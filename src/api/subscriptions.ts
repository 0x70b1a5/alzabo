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

    const { collections, model, ask, systemMsg, createChatCompletion, getCollection, getCollections, selectedCollectionId, selectedDocument, updateDocument, askStage, queryCollection } = get()

    switch (type) {
      case 'get-collections': {
        const collections: any = {};
        (update as OurCollection[]).forEach(coll => collections[coll.id] = coll)
        set({ collections, loading: '' })
        break
      } case 'create-collection': {
        collections[update.id] = update
        set({ collections, loading: '' })
        break
      } case 'get-collection': {
        collections[selectedCollectionId] = { ...collections[selectedCollectionId], ...update }
        set({ collections, loading: '' })
        break
      } case 'create-embeddings': {
        // verify the embedding 
        const newEmbedding = update.data?.[0]?.embedding
        console.log({new_emb: newEmbedding, update, data: update.data, embedding: update.data?.[0]?.embedding})
        if (!(Array.isArray(newEmbedding) && newEmbedding.every(e => !isNaN(e)))) {
          alert('Something was weird about the embedding we got back.')
        }

        console.log('legit embeddings', {askStage})

        if (askStage === 1) { // we are in the middle of an ask
          set({ askStage: 2, loading: 'Assessing Uqbar capabilities...' })
          const uqId = Object.keys(collections).find(k => collections[k].name === 'uqbar')
          if (!uqId) {
            alert('could not find uqbars collection. ensure you have an uqbar collection loaded which is populated with capabilities')
            set({ askStage: 0, loading: '' })
            return
          }
          queryCollection(uqId, newEmbedding, '5')
        } else { // we are adding a doc to a coll
          set ({ newEmbedding })
        }
        break
      } case 'query-collection': {
        console.log('querying', {askStage})
        if (askStage === 2) { // the N closest api capabilities have just returned
          if (!(update?.documents?.[0]?.length > 0)) {
            set ({ askStage: 0, loading: '', })
            alert('There was an issue retrieving results from the vector store: ' + JSON.stringify(update))
            return
          }
          set({ askStage: 3, loading: `Consulting ${model}...` })
          createChatCompletion([
            systemMsg, 
            { role: 'assistant', 
              content: `User intent:\n- ${ask}\n\nRecommendations:\n${update.documents[0].map((sugg:string) => `- ${sugg}\n`)}\nResponse:\n` } ])
        }
        break
      } case 'create-completion': {
        console.log('got completion', update)
        if (!update?.choices?.[0]?.message?.content) {
          alert('unexpected response from llm: ' + JSON.stringify(update))
          return
        }
        set({ askStage: 4, loading: '', llmAnswer: update.choices[0].message.content })
        break
      } case 'upsert-document': {
        if (Boolean(update) === update) {
          // success
          getCollections()
          getCollection(selectedCollectionId)
        } else {
          alert('Issue upserting document.')
        }
        break
      } case 'reset': {
        alert('Database has been reset. Please reload to see changes.')
        break
      } case 'add-document': {
        if (Boolean(update) === update) {
          // success
          getCollection(selectedCollectionId)
        } else if (update.detail) {
          // failure?
          alert(JSON.stringify(update.detail))
          set({ loading: '' })
        }
        break
      } default:
        throw 'Unprocessed update type: '+type
    }
  }
}