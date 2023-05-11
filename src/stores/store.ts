import { create } from 'zustand'
import { Collection } from 'chromadb'
import { OurCollection, SingleDocument } from '../types/types'
import api from '../api/index'
import { handleAlzaboUpdate } from '../api/subscriptions'
import { createSubscription } from '../api/createSubscription'

export interface AlzaboStore {
  createCollection: (name: string) => Promise<void>
  addDocumentToCollection: (collId: string, docId: string, docContent: string, embedding: number[], metadata: any) => Promise<void>
  queryCollection: (name: string, query: number[]) => Promise<any>
  saveApiKey: (apiKey: string) => Promise<void>
  init: () => Promise<any>,
  collections: { [name: string]: OurCollection }
  loading: string
  hasApiKey: boolean
  hasSubscribed: boolean
  setHasApiKey: (hasApiKey: boolean) => void
  checkApiKey: () => Promise<any>
  getCollections: () => Promise<void>
  getCollection: (name: string) => Promise<void>
  createEmbeddings: (text: string) => Promise<any>
  selectedCollectionId: string,
  selectedDocument: string,
  newEmbedding: number[] | null,
  setNewEmbedding: (newEmbedding: number[] | null) => void
  setSelectedCollectionId: (id: string) => void
  setSelectedDocument: (id: string) => void
  updateDocument: (id: string, document: string, embeddings: number[], metadata: any) => Promise<any>
}

const onSuccess = () => 'poke succeeded'

export const useAlzaboStore = create<AlzaboStore>((set, get) => ({
  loading: '',
  selectedCollectionId: '',
  selectedDocument: '',
  newEmbedding: null,
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
  setNewEmbedding: (newEmbedding: number[] | null) => set({ newEmbedding }),
  setSelectedCollectionId: (id: string) => set({ selectedCollectionId: id }),
  setSelectedDocument: (id: string) => set({ selectedDocument: id }),
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
  getCollection: async (id: string) => {
    const result = await api.poke({ 
      app: 'alzabo', 
      mark: 'alzabo-action', 
      json: { 'collection-name': id, action: { 'get-collection': '{}' } }, onSuccess })
  },
  createCollection: async(name: string) => {
    await api.poke({ 
      app: 'alzabo', 
      mark: 'alzabo-action', 
      json: { 'collection-name': name, action: { 'create': `{ "name": "${name}" }` } }, onSuccess })
  },
  addDocumentToCollection: async (collId: string, docId: string, docContent: string, embedding: number[], metadata: any) => {
    const result = await api.poke({ 
      app: 'alzabo', 
      mark: 'alzabo-action', 
      json: { 'collection-name': collId, action: { 'add-document': JSON.stringify({
        embeddings: embedding, 
        metadata: metadata || { }, 
        document: docContent, 
        id: docId
      }) } } })
  },
  updateDocument: async (id: string, document: string, embedding: number[], metadata: any) => {
    const { selectedCollectionId } = get()
    const result = await api.poke({ 
      app: 'alzabo', 
      mark: 'alzabo-action', 
      json: { 'collection-name': selectedCollectionId, action: { 'upsert-document': JSON.stringify({
        embeddings: [embedding], 
        metadatas: [metadata], 
        documents: [document], 
        ids: [id]
      }) } } })
  },
  queryCollection: async(name: string, query: any) => {
    const result = await api.poke({ 
      app: 'alzabo', 
      mark: 'alzabo-action', 
      json: { 'collection-name': name, action: { query: JSON.stringify({ query_embeddings: query, n_results: 5, where: {} }) } } })
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
    await queryCollection(collection, embedding)
  }
}))