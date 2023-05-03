import { SingleDocument } from '../types/types'
import Urbit from '@urbit/http-api'

export const API_KEY_LOCALSTORAGE_KEY = 'alzabo-apikey'

export const upi = new Urbit('')
// @ts-ignore window typings
upi.ship = 'dev'

export const api = {
  async checkApiKey() {
    return await upi.scry({ app: 'alzabo', path: '/has-api-key' })
  },
  async saveApiKey(key: string) {
    await upi.poke({ 
      app: 'alzabo', 
      mark: 'alzabo-action', 
      json: { 'collection-name': '', action: { 'save-api-key': key } } })
  },
  async createEmbeddings(
    text: string,
  ): Promise<any> {
    await upi.poke({ 
      app: 'alzabo', 
      mark: 'alzabo-action', 
      json: { 'collection-name': '', action: { 'create-embeddings': text } } })
  },
  async createCollection(
    collection: string,
  ): Promise<any> {
    await upi.poke({ 
      app: 'alzabo', 
      mark: 'alzabo-action', 
      json: { 'collection-name': collection, action: { 'create': `{ "name": "${collection}" }` } } })
  },
  async addDocumentToCollection(
    collection: string,
    doc: SingleDocument,
  ): Promise<any> {
    await upi.poke({ 
      app: 'alzabo', 
      mark: 'alzabo-action', 
      json: { 'collection-name': collection, action: { 'add-document': JSON.stringify(doc) } } })
  },
  async queryCollection(
    collection: string,
    query: string,
  ): Promise<any> {
    await upi.poke({ 
      app: 'alzabo', 
      mark: 'alzabo-action', 
      json: { 'collection-name': collection, action: { query } } })
  },
  async getCollections(): Promise<any> {
    await upi.poke({ 
      app: 'alzabo', 
      mark: 'alzabo-action', 
      json: { 'collection-name': '', action: { 'get-collections': null } } })
  },
  async getCollection(name: string): Promise<any> {
    await upi.poke({ 
      app: 'alzabo', 
      mark: 'alzabo-action', 
      json: { 'collection-name': name, action: { 'get-collection': '{}' } } })
  },
}