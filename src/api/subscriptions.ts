import { StoreApi } from 'zustand';
import { AlzaboStore } from '../stores/store';
import { OurCollection } from '../types/types';

export const handleAlzaboUpdate = (get: StoreApi<AlzaboStore>['getState'], set: StoreApi<AlzaboStore>['setState']) => {
  console.log({ state: get() })
  return ({ update: rawUpdate }: { update: string }) => {
    let parsed: any = {}
    try {
      parsed = JSON.parse(rawUpdate)
    } catch (err) {
      console.error('Failed to parse JSON', rawUpdate)
      return
    }
    const { type, update } = parsed
    console.log(`[${type} UPDATE]:`, update)

    if (update.error) {
      const err = typeof update.message === 'string' ? update.message
        : typeof update.error === 'string' ? update.error
        : typeof update?.error === 'string' ? update.error.message
        : JSON.stringify(update)
      alert('Error: ' + err)
      return
    }

    const { collections, getCollection, selectedCollectionId, selectedDocument, updateDocument } = get()

    switch (type) {
      case 'get-collections': {
        const collections: any = {};
        (update as OurCollection[]).forEach(coll => collections[coll.id] = coll)
        set({ collections })
        break
      } case 'create-collection': {
        collections[update.id] = update
        set({ collections })
        break
      } case 'get-collection': {
        collections[selectedCollectionId] = { ...collections[selectedCollectionId], ...update }
        set({ collections })
        break
      } case 'create-embeddings': {
        let ourIdx = -1
        const newEmbedding = update.data?.[0]?.embedding
        console.log({new_emb: newEmbedding, update, data: update.data, embedding: update.data?.[0]?.embedding})
        if (!(Array.isArray(newEmbedding) && newEmbedding.every(e => !isNaN(e)))) {
          return
        } 
        set ({ newEmbedding })
        break
      } case 'upsert-document': {
        const coll = collections[selectedCollectionId]
        const idx = coll.ids.indexOf(selectedDocument)
        if (Boolean(update) === update) {
          // success
        }
        break
      } case 'add-document': {
        if (Boolean(update) === update) {
          // success
          getCollection(selectedCollectionId)
        } else if (update.detail) {
          // failure?
          alert(JSON.stringify(update.detail))
        }
        break
      } default:
        throw 'Unprocessed update type: '+type
    }
  }
}