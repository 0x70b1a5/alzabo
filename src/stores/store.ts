import { create } from 'zustand'
import { Collection } from 'chromadb'
import { SingleDocument } from '../types/types'
import { API_KEY_LOCALSTORAGE_KEY, api, upi } from '../api/api'
import { handleAlzaboUpdate } from '../api/subscriptions'
import { createSubscription } from '../api/createSubscription'

export interface AbomiStore {
  createCollection: (name: string) => Promise<void>
  addDocumentToCollection: (name: string, doc: SingleDocument) => Promise<void>
  queryCollection: (name: string, query: string) => Promise<any>
  saveApiKey: (apiKey: string) => Promise<void>
  init: () => Promise<any>,
  collections: { [name: string]: any }
  loading: string
  apiKey: string
  getCollections: () => Promise<void>
  getCollection: (name: string) => Promise<void>
}

export const useAbomiStore = create<AbomiStore>((set, get) => ({
  loading: '',
  apiKey: '',
  init: async () => {
    const collex = await api.getCollections()
    const apiKey = localStorage.getItem(API_KEY_LOCALSTORAGE_KEY)
    if (apiKey) set ({ apiKey })
    await upi.subscribe(createSubscription('alzabo', '/update', handleAlzaboUpdate(get, set), (err) => {
      console.warn('Subscription to /updates quit.')
    }))
  },
  collections: {},
  getCollections: async () => {
    const result = await api.getCollections()
    const collections: any = {};
    (result as any[]).forEach((c: any) => {
      collections[c.name as string] = c as Collection
    })
    set ({ collections })
  },
  getCollection: async (name: string) => {
    const result = await api.getCollection(name)
    debugger
  },
  createCollection: async(name: string) => {
    const { collections } = get()
    const collection = await api.createCollection(name)
    await get().getCollections()
  },
  addDocumentToCollection: async(name: string, doc: SingleDocument) => {
    const { collections } = get()
    const result = await api.addDocumentToCollection(name, doc)
    debugger
    await get().getCollections()
    // collections[name] = result
    // set({ collections })
  },
  queryCollection: async(name: string, query: string) => {
    const { collections } = get()
    const result = await api.queryCollection(name, query)
    debugger
  },
  saveApiKey: async (apiKey: string) => {
    localStorage.setItem(API_KEY_LOCALSTORAGE_KEY, apiKey)
    alert('Api key saved.')
    set({ apiKey })
  }
}))