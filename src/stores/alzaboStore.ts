import { create } from 'zustand'
import { Collection } from 'chromadb'
import { ChatMessage, OurCollection, SingleDocument } from  '../types/types'
import api from '../api/index'
import { handleAlzaboUpdate } from '../api/subscriptions'
import { createSubscription } from '../api/createSubscription'
import { SYSTEM_PROMPT } from '../constants/prompt'

export interface AlzaboStore {
  collections: { [name: string]: OurCollection }
  queryResults: SingleDocument[] | null
  loading: string
  hasApiKey: boolean
  hasSubscribed: boolean
  chromaInitialized: boolean
  selectedCollectionId: string
  selectedDocument: string
  newEmbedding: number[] | null
  tabs: string[],
  askStage: number
  systemMsg: ChatMessage
  activeTab: string,
  chatHistory: ChatMessage[]
  model: string
  ask: string
  models: string[]
  llmAnswer: string
  temperature: number
  newApiKey: string,
  editApiKey: boolean,
  setNewApiKey: (newApiKey: string) => void,
  setEditApiKey: (editApiKey: boolean) => void,
  createCollection: (name: string) => Promise<void>
  addDocumentToCollection: (collId: string, docId: string, docContent: string, embedding: number[], metadata: any) => Promise<void>
  queryCollection: (collId: string, query: number[], nResults: string) => Promise<any>
  saveApiKey: (apiKey: string) => Promise<void>
  init: () => Promise<any>,
  setNewEmbedding: (newEmbedding: number[] | null) => void
  setHasApiKey: (hasApiKey: boolean) => void
  checkApiKey: () => Promise<any>
  getCollections: () => Promise<void>
  getCollection: (name: string) => Promise<void>
  createEmbeddings: (text: string) => Promise<any>
  setSelectedCollectionId: (id: string) => void
  setSelectedDocument: (id: string) => void
  updateDocument: (id: string, document: string, embeddings: number[], metadata: any) => Promise<any>
  setQueryResults: (r: SingleDocument[] | null) => void
  setAskStage: (askStage: number) => void
  setActiveTab: (activeTab: string) => void
  setLoading: (loading: string) => void
  setChatHistory: (chatHistory: ChatMessage[]) => void
  setModels: (models: string[]) => void
  setModel: (model: string) => void
  setAsk: (model: string) => void
  setTemperature: (temperature: number) => void
  createChatCompletion: (messages: ChatMessage[]) => Promise<any>
  sxnCn: string
  btn: string
  ipt: string
}

const onSuccess = () => 'poke succeeded'

export const useAlzaboStore = create<AlzaboStore>((set, get) => ({
  loading: '',
  selectedCollectionId: '',
  selectedDocument: '',
  queryResults: null,
  newEmbedding: null,
  hasApiKey: false,
  hasSubscribed: false,
  chromaInitialized: false,
  activeTab: 'build',
  askStage: 0,
  chatHistory: [],
  temperature: 0.7,
  tabs: ['build', 'embeddings', 'chat', 'settings'],
  collections: {},
  ask: '',
  llmAnswer: '',
  newApiKey: '',
  editApiKey: false,
  model: 'gpt-4',
  models: [],
  sxnCn: 'bg-gray-700 rounded-xl shadow border p-8 m-10',
  btn: 'px-2 py-1 bg-gray-500 rounded hover:bg-cyan-100 hover:text-black disabled:pointer-events-none disabled:opacity-75 disabled:cursor-not-allowed',
  ipt: 'px-2 bg-gray-800 rounded',
  systemMsg: { role: 'system', content: SYSTEM_PROMPT },
  setNewApiKey: (newApiKey: string) => set({ newApiKey }),
  setEditApiKey: (editApiKey: boolean) => set({ editApiKey }),
  setTemperature: (temperature: number) => set({ temperature }),
  setModels: (models: string[]) => set({ models }),
  setModel: (model: string) => set({ model }),
  setAsk: (ask: string) => set({ ask }),
  setActiveTab: (activeTab: string) => set({ activeTab }),
  setLoading: (loading: string) => set({ loading }),
  setAskStage: (askStage: number) => set({ askStage }),
  checkApiKey: async () => await api.scry({ app: 'alzabo', path: '/has-api-key' }),
  setChatHistory: (chatHistory: ChatMessage[]) => set({ chatHistory }),
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
  getCollections: async () => {
    set({ loading: 'Fetching collections...' })
    const result = await api.poke({ 
      app: 'alzabo', 
      mark: 'alzabo-action', 
      json: { 'collection-name': '', action: { 'get-collections': null } }, onSuccess })
  },
  getCollection: async (id: string) => {
    set({ loading: 'Fetching collection...' })
    const result = await api.poke({ 
      app: 'alzabo', 
      mark: 'alzabo-action', 
      json: { 'collection-name': id, action: { 'get-collection': '{}' } }, onSuccess })
  },
  createCollection: async(name: string) => {
    set({ loading: 'Creating collection...' })
    await api.poke({ 
      app: 'alzabo', 
      mark: 'alzabo-action', 
      json: { 'collection-name': name, action: { 'create-collection': `{ "name": "${name}" }` } }, onSuccess })
  },
  addDocumentToCollection: async (collId: string, docId: string, docContent: string, embedding: number[], metadata: any) => {
    set({ loading: 'Adding document to collection...' })
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
  setQueryResults: (queryResults: SingleDocument[] | null) => {
    set({ queryResults })
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
  queryCollection: async(collId: string, query: number[], n_results: string) => {
    console.log('querying collection',collId)
    const result = await api.poke({ 
      app: 'alzabo', 
      mark: 'alzabo-action', 
      json: { 'collection-name': collId, action: { 'query-collection': JSON.stringify({ query_embeddings: [query], n_results, where: {} }) } } })
  },
  saveApiKey: async (apiKey: string) => {
    await api.poke({ 
      app: 'alzabo', 
      mark: 'alzabo-action', 
      json: { 'collection-name': '', action: { 'save-api-key': apiKey } }, onSuccess })
    set({ hasApiKey: true })
  },
  createEmbeddings: async(text: string) => {
    // TODO: check our collections for duplicates of the string to avoid multiple calls
    return await api.poke({ 
      app: 'alzabo', 
      mark: 'alzabo-action', 
      json: { 'collection-name': '', action: { 'create-embeddings': text } } })
  },
  createChatCompletion: async(messages: ChatMessage[]) => {
    const { temperature, model } = get()
    return await api.poke({ 
      app: 'alzabo', 
      mark: 'alzabo-action', 
      json: { 'collection-name': '', action: { 'create-completion': JSON.stringify({
        temperature, model, messages
      }) } } })
  },
  getNearestNeighbors: async(collection: string, embedding: number[], n_results: string, where: any = {}) => {
    const {queryCollection } = get()
    await queryCollection(collection, embedding, n_results)
  },
}))