import { SingleDocument } from '../types/types'
import Urbit from '@urbit/http-api'

export const API_KEY_LOCALSTORAGE_KEY = 'alzabo-apikey'

export const upi = new Urbit('')
// @ts-ignore window typings
upi.ship = 'dev'

export const api = {
  async so() {
    console.log('subbing once')
    await upi.subscribeOnce('alzabo', 'update')
    console.log('subbed')
  },
  async createEmbeddings(
    text: string,
  ): Promise<any> {
    await this.so()
    await upi.poke({ 
      app: 'alzabo', 
      mark: 'alzabo-action', 
      json: { 'collection-name': '', action: { 'create-embeddings': text } } })
  },
  async createCollection(
    collection: string,
  ): Promise<any> {
    await this.so()
    await upi.poke({ 
      app: 'alzabo', 
      mark: 'alzabo-action', 
      json: { 'collection-name': collection, action: { 'create-collection': null } } })
  },
  async addDocumentToCollection(
    collection: string,
    doc: SingleDocument,
  ): Promise<any> {
    await this.so()
    await upi.poke({ 
      app: 'alzabo', 
      mark: 'alzabo-action', 
      json: { 'collection-name': collection, action: { 'add-document': doc } } })
  },
  async queryCollection(
    collection: string,
    query: string,
  ): Promise<any> {
    await this.so()
    await upi.poke({ 
      app: 'alzabo', 
      mark: 'alzabo-action', 
      json: { 'collection-name': collection, action: { query } } })
  },
  async getCollections(): Promise<any> {
    await this.so()
    await upi.poke({ 
      app: 'alzabo', 
      mark: 'alzabo-action', 
      json: { 'collection-name': '', action: { 'get-collections': null } } })
  },
  async getCollection(name: string): Promise<any> {
    await this.so()
    await upi.poke({ 
      app: 'alzabo', 
      mark: 'alzabo-action', 
      json: { 'collection-name': name, action: { 'get-collection': '{}' } } })
  },
}