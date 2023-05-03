import { StoreApi } from 'zustand';
import { AlzaboStore } from '../stores/store';

export const handleAlzaboUpdate = (get: StoreApi<AlzaboStore>['getState'], set: StoreApi<AlzaboStore>['setState']) => {
  console.log({ state: get() })
  return (update: any) => {
    console.log('[UPDATE] ', update)
  }
}