import { createEffect, createEvent, createStore, sample } from 'effector'
import { connect, ConnectConfig, ConnectedWalletAccount, keyStores, WalletConnection } from 'near-api-js'
import { AccountBalance } from 'near-api-js/lib/account';
import { interval, reset } from 'patronum';
import { getConfig } from '../config';
import { IGetSingleMarketFxParams, IMarket, IOrderBook } from '../types';

const { contractAddress, networkId, nodeUrl, walletUrl, helperUrl } = getConfig();

const myKeyStore = new keyStores.BrowserLocalStorageKeyStore();

const connectionConfig: ConnectConfig = {
  networkId,
  keyStore: myKeyStore, // first create a key store 
  nodeUrl,
  walletUrl,
  helperUrl,
  headers: {}
};

export const signInButtonClicked = createEvent()
export const signOutButtonClicked = createEvent()
export const nearConnectionRequested = createEvent()
export const startFetchingBalance = createEvent()
export const stopFetchingBalance = createEvent()
export const marketsRequested = createEvent()
export const marketSelected = createEvent<number>()

export const connectNearFx = createEffect(() => connect(connectionConfig))
export const signInFx = createEffect(
  (walletConnection: WalletConnection) =>
    walletConnection.requestSignIn(
      "app_2.spin_swap.testnet", // contract requesting access
      "Spin Test Challenge", // optional title
    )
)
export const signOutFx = createEffect(
  (walletConnection: WalletConnection) =>
    walletConnection.signOut()
)
export const getBalanceFx = createEffect((account: ConnectedWalletAccount) => account.getAccountBalance())
export const getMarketsFx = createEffect(
  (account: ConnectedWalletAccount) => account.viewFunction(
    contractAddress,
    'markets',
    {}
  ) as Promise<IMarket[]>
)
export const getSingleMarketFx = createEffect(
  ({ account, market_id }: IGetSingleMarketFxParams) => account.viewFunction(
    contractAddress,
    'view_market',
    { market_id }
  ) as Promise<IOrderBook>
)

export const $walletConnection = createStore<WalletConnection | null>(null)
export const $balance = createStore<AccountBalance | null>(null)
export const $markets = createStore<IMarket[]>([])
export const $selectedMarket = createStore<IMarket | null>(null)
export const $orderBook = createStore<IOrderBook>({ ask_orders: [], bid_orders: [] })
export const $account = $walletConnection.map(wc => wc?.account() ?? null)

sample({
  clock: connectNearFx.doneData,
  fn: nearConnection => new WalletConnection(nearConnection, null),
  target: $walletConnection
})

sample({
  clock: signInButtonClicked,
  source: $walletConnection,
  filter: Boolean,
  target: signInFx
})

sample({
  clock: signOutButtonClicked,
  source: $walletConnection,
  filter: Boolean,
  target: signOutFx
})

reset({
  clock: signOutFx.done,
  target: [$balance, $markets, $selectedMarket, $orderBook],
})

sample({
  clock: nearConnectionRequested,
  target: connectNearFx
})

const { tick } = interval({
  start: startFetchingBalance,
  stop: stopFetchingBalance,
  timeout: 2000,
  leading: true,
})

sample({
  clock: tick,
  source: $account,
  filter: Boolean,
  target: getBalanceFx
})

sample({
  clock: getBalanceFx.doneData,
  target: $balance
})

sample({
  clock: $account,
  filter: Boolean,
  target: startFetchingBalance
})

sample({
  clock: $account,
  filter: account => account === null,
  target: stopFetchingBalance
})

sample({
  clock: marketsRequested,
  source: $account,
  filter: Boolean,
  target: getMarketsFx
})

sample({
  clock: $account,
  filter: Boolean,
  target: marketsRequested
})

sample({
  clock: getMarketsFx.doneData,
  target: $markets
})

sample({
  clock: marketSelected,
  source: $markets,
  fn: (markets, id) => markets.find(m => m.id === id) ?? null,
  target: $selectedMarket
})

sample({
  clock: $selectedMarket,
  source: $account,
  filter: (account, market) => market !== null && account !== null,
  fn: (account, market) => ({ account, market_id: market?.id }) as IGetSingleMarketFxParams,
  target: getSingleMarketFx
})

sample({
  clock: getSingleMarketFx.doneData,
  target: $orderBook
})

nearConnectionRequested()
