import { createEffect, createEvent, createStore, sample } from 'effector'
import { connect, ConnectConfig, ConnectedWalletAccount, keyStores, WalletConnection } from 'near-api-js'
import { AccountBalance } from 'near-api-js/lib/account';
import { interval, not } from 'patronum';

const myKeyStore = new keyStores.BrowserLocalStorageKeyStore();

const connectionConfig: ConnectConfig = {
  networkId: "testnet",
  keyStore: myKeyStore, // first create a key store 
  nodeUrl: "https://rpc.testnet.near.org",
  walletUrl: "https://wallet.testnet.near.org",
  helperUrl: "https://helper.testnet.near.org",
  headers: {}
};

export const signInButtonClicked = createEvent()
export const signOutButtonClicked = createEvent()
export const nearConnectionRequested = createEvent()
export const startFetchingBalance = createEvent()
export const stopFetchingBalance = createEvent()

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

export const $walletConnection = createStore<WalletConnection | null>(null)
export const $balance = createStore<AccountBalance | null>(null)
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

nearConnectionRequested()

