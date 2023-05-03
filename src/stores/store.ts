import { create } from 'zustand'
import { Collection } from 'chromadb'
import { SingleDocument } from '../types/types'
import { API_KEY_LOCALSTORAGE_KEY, api } from '../api/api'
import { handleAlzaboUpdate } from '../api/subscriptions'
import { createSubscription } from '../api/createSubscription'

export interface AlzaboStore {
  createCollection: (name: string) => Promise<void>
  addDocumentToCollection: (name: string, doc: SingleDocument) => Promise<void>
  queryCollection: (name: string, query: string) => Promise<any>
  saveApiKey: (apiKey: string) => Promise<void>
  init: () => Promise<any>,
  collections: { [name: string]: any }
  loading: string
  hasApiKey: boolean
  hasSubbed: boolean
  setHasApiKey: (hasApiKey: boolean) => void
  checkApiKey: () => Promise<any>
  getCollections: () => Promise<void>
  getCollection: (name: string) => Promise<void>
}

const onSuccess = () => 'poke succeeded'

export const useAlzaboStore = create<AlzaboStore>((set, get) => ({
  loading: '',
  hasApiKey: false,
  hasSubbed: false,
  checkApiKey: async () => await api.scry({ app: 'alzabo', path: '/has-api-key' }),
  init: async () => {
    if (!get().hasSubbed) {
      const id = await api.subscribe(createSubscription('alzabo', '/update', handleAlzaboUpdate(get, set), (err) => {
        console.warn('Subscription to /update quit.')
      }))
      console.log({ id })
      set({ hasSubbed: true })
    }
    console.log('subscribed')
    const hasApiKey = await get().checkApiKey()
    set ({ hasApiKey })
  },
  setHasApiKey: async (hasApiKey: boolean) => {
    set({ hasApiKey })
  },
  collections: {},
  getCollections: async () => {
    const result = await api.poke({ 
      app: 'alzabo', 
      mark: 'alzabo-action', 
      json: { 'collection-name': '', action: { 'get-collections': null } }, onSuccess })
  },
  getCollection: async (name: string) => {
    const result = await api.poke({ 
      app: 'alzabo', 
      mark: 'alzabo-action', 
      json: { 'collection-name': name, action: { 'get-collection': '{}' } }, onSuccess })
    debugger
  },
  createCollection: async(name: string) => {
    const { collections } = get()
    await api.poke({ 
      app: 'alzabo', 
      mark: 'alzabo-action', 
      json: { 'collection-name': name, action: { 'create': `{ "name": "${name}" }` } }, onSuccess })
    await get().getCollections()
  },
  addDocumentToCollection: async(name: string, doc: SingleDocument) => {
    const { collections } = get()
    const result = await api.poke({ 
      app: 'alzabo', 
      mark: 'alzabo-action', 
      json: { 'collection-name': name, action: { 'add-document': JSON.stringify(doc) } } })
    debugger
    await get().getCollections()
    // collections[name] = result
    // set({ collections })
  },
  queryCollection: async(name: string, query: string) => {
    const { collections } = get()
    const result = await api.poke({ 
      app: 'alzabo', 
      mark: 'alzabo-action', 
      json: { 'collection-name': name, action: { query } } })
    debugger
  },
  saveApiKey: async (apiKey: string) => {
    await api.poke({ 
      app: 'alzabo', 
      mark: 'alzabo-action', 
      json: { 'collection-name': '', action: { 'save-api-key': apiKey } }, onSuccess })
    set({ hasApiKey: true })
  },
  createEmbeddings: async(text: string) => {
    await api.poke({ 
      app: 'alzabo', 
      mark: 'alzabo-action', 
      json: { 'collection-name': '', action: { 'create-embeddings': text } } })
  }
}))