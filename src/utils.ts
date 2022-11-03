import { utils } from 'near-api-js';

export const formatNear = (near: string) => Number(utils.format.formatNearAmount(near)).toFixed(4)