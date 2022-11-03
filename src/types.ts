import { ConnectedWalletAccount } from 'near-api-js';

export interface IMarket {
  id: number;
  base: {
    address: string;
    decimal: number;
    ticker: string;
  };
  fee: number;
  quote: {
    address: string
    decimal: number
    ticker: string
  }
}

export interface IOrder {
  price: number;
  quantity: number;
}

export interface IOrderBook {
  ask_orders: IOrder[];
  bid_orders: IOrder[];
}

export interface IGetSingleMarketFxParams {
  market_id: number
  account: ConnectedWalletAccount
}
