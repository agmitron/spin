import { utils } from 'near-api-js';
import { IMarket } from './types';

export const formatNear = (near: string) => utils.format.formatNearAmount(near, 4)
export const formatNearExponential = (near: number) => formatNear(BigInt(near).toString())
export const stringifyMarket = ({ base, quote }: IMarket) => `${base.ticker}/${quote.ticker}`
