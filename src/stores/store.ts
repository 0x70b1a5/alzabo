import { create } from 'zustand'
import { Collection } from 'chromadb'
import { SingleDocument } from '../types/types'
import api from '../api/index'
import { handleAlzaboUpdate } from '../api/subscriptions'
import { createSubscription } from '../api/createSubscription'

export interface AlzaboStore {
  createCollection: (name: string) => Promise<void>
  addDocumentToCollection: (name: string, doc: SingleDocument) => Promise<void>
  queryCollection: (name: string, query: { embeddings: number[][], results: number, where: { [key: string]: string } }) => Promise<any>
  saveApiKey: (apiKey: string) => Promise<void>
  init: () => Promise<any>,
  collections: { [name: string]: any }
  loading: string
  hasApiKey: boolean
  hasSubscribed: boolean
  setHasApiKey: (hasApiKey: boolean) => void
  checkApiKey: () => Promise<any>
  getCollections: () => Promise<void>
  getCollection: (name: string) => Promise<void>
  createEmbeddings: (text: string) => Promise<any>
}

const onSuccess = () => 'poke succeeded'

export const useAlzaboStore = create<AlzaboStore>((set, get) => ({
  loading: '',
  hasApiKey: false,
  hasSubscribed: false,
  checkApiKey: async () => await api.scry({ app: 'alzabo', path: '/has-api-key' }),
  init: async () => {
    if (!get().hasSubscribed) {
      const id = await api.subscribe(createSubscription('alzabo', '/update', handleAlzaboUpdate(get, set), (err) => {
        console.warn('Subscription to /update quit.')
      }))
      console.log({ id })
      set({ hasSubscribed: true })
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
    await api.poke({ 
      app: 'alzabo', 
      mark: 'alzabo-action', 
      json: { 'collection-name': name, action: { 'create': `{ "name": "${name}" }` } }, onSuccess })
    await get().getCollections()
  },
  addDocumentToCollection: async(name: string, doc: SingleDocument) => {
    const result = await api.poke({ 
      app: 'alzabo', 
      mark: 'alzabo-action', 
      json: { 'collection-name': name, action: { 'add-document': JSON.stringify(doc) } } })
    debugger
    await get().getCollections()
    // collections[name] = result
    // set({ collections })
  },
  queryCollection: async(name: string, query: any) => {
    const result = await api.poke({ 
      app: 'alzabo', 
      mark: 'alzabo-action', 
      json: { 'collection-name': name, action: { query: JSON.stringify(query) } } })
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
    return await api.poke({ 
      app: 'alzabo', 
      mark: 'alzabo-action', 
      json: { 'collection-name': '', action: { 'create-embeddings': text } } })
  },
  getNearestNeighbors: async(collection: string, embedding: number[], results: number, where: any = {}) => {
    const {queryCollection } = get()
    await queryCollection(collection, { results, where, embeddings: [embedding] })
  }
}))