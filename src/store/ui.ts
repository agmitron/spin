import { createEvent, createStore, sample } from 'effector';

export enum Filter {
  Ask,
  Bid
}

export const $filter = createStore<Filter>(Filter.Ask)

export const filterChanged = createEvent<Filter>()

sample({
  clock: filterChanged,
  target: $filter
})
