import { StoreApi } from "zustand";
import { AbomiStore } from "../stores/store";

export const handleAlzaboUpdate = (get: StoreApi<AbomiStore>['getState'], set: StoreApi<AbomiStore>['setState']) => (update: any) => {
  console.log('[UPDATE] ', update)
}