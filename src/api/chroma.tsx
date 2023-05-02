import axios from 'axios';
import { SingleDocument } from '../types/types';

const API_BASE_URL = 'http://localhost:3000';
export const API_KEY_LOCALSTORAGE_KEY = 'abominatus-apikey'

const headers = () => {
  return { Authorization: `Bearer ${localStorage.getItem(API_KEY_LOCALSTORAGE_KEY)}` }
}
export const api = {
  async createEmbeddings(
    collection: string,
    text: string,
  ): Promise<any> {
    const response = await axios.post(`${API_BASE_URL}/createEmbeddings`, {
      collection,
      text,
    }, {
      headers: headers()
    });
    return response.data;
  },
  async createCollection(
    collection: string,
  ): Promise<any> {
    const response = await axios.post(`${API_BASE_URL}/createCollection`, {
      collection,
    }, {
      headers: headers()
    });
    return response.data;
  },
  async addDocumentToCollection(
    collection: string,
    doc: SingleDocument,
  ): Promise<any> {
    const response = await axios.post(`${API_BASE_URL}/addDocumentToCollection`, {
      collection,
      doc,
    }, {
      headers: headers()
    });
    return response.data;
  },
  async queryCollection(
    collection: string,
    query: string,
  ): Promise<any> {
    const response = await axios.get(`${API_BASE_URL}/queryCollection`, {
      params: {
        collection,
        query,
      },
    });
    return response.data;
  },
  async getCollections(): Promise<any> {
    const response = await axios.get(`${API_BASE_URL}/collections`);
    return response.data;
  },
  async getCollection(name: string): Promise<any> {
    const response = await axios.get(`${API_BASE_URL}/collections/${name}`);
    debugger
    return response.data;
  },
}