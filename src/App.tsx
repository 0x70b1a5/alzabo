import React, { useEffect, useState } from 'react';
import './App.css';
import { Input } from 'postcss';
import { useAbomiStore } from './stores/store';
import classNames from 'classnames';
import { LoadingOverlay } from './components/LoadingOverlay';
import { Col, Row } from './components/RowCol';

function App() {
  const { init, saveApiKey, apiKey, collections, addDocumentToCollection, queryCollection, getCollection, createCollection, getCollections } = useAbomiStore()
  const [initted, setInitted] = useState(false)
  const [newDocContent, setNewDocContent] = useState('')
  const [newDocName, setNewDocName] = useState('')
  const [selectedCollection, setSelectedCollection] = useState('')
  const [newApiKey, setNewApiKey] = useState('')
  const [newCollectionName, setNewCollectionName] = useState('')

  useEffect(() => {
    if (!initted) init()
    setInitted(true)
    getCollections()
  }, [])

  useEffect(() => {
    if (selectedCollection) {
      getCollection(selectedCollection)
    }
  }, [selectedCollection])

  const onAddDocToCollection = async () => {
    try {
      await addDocumentToCollection(selectedCollection, { id: newDocName, content: newDocContent, metadata: {}, embeddings: [] })
      setNewDocContent('')
      setNewDocName('')
      await getCollections()
    } catch (e) {
      debugger
      alert('Error adding new document. Please check your API key.')
    }
  }

  const onCreateCollection = async () => {
    if (!newCollectionName) return
    try {
      await createCollection(newCollectionName)
      setNewCollectionName('')
    } catch (e) {
      debugger
      alert('Error adding new collection')
    }
  }

  return (
    <div className="container mx-auto bg-gray-200 rounded-xl shadow border p-8 m-10">
      <header>
        <p>
          ABOMINATUS EST
        </p> 
      </header>
      <section className='my-1'>
        <h2 className='my-1'>Settings</h2>
        <input placeholder='api key' value={newApiKey} onChange={(e) => setNewApiKey(e.currentTarget.value)} />
        <button disabled={!Boolean(newApiKey)} type="button" onClick={() => {saveApiKey(newApiKey)}}>save</button>
      </section>
      <Col className='my-1'>
        <h2 className='my-1'>Collections</h2>
        <p>Select a collection to add documents to:</p>
        <Row className='ml-5'>
          {Object.keys(collections).map(c => <Row className={classNames('p-2 mr-5 bg-lime-100 cursor-pointer rounded collection hover:bg-lime-500', { 'text-white': c === selectedCollection,  'bg-lime-900': c === selectedCollection })} key={c} 
          onClick={() => setSelectedCollection(c)}>
            <h3>{c}</h3>
          </Row>)}
        </Row>
      </Col>
      <section className='flex flex-col my-1'>
        <h2 className='my-1'>Add collection</h2>
        <input placeholder='name' value={newCollectionName} onChange={(e) => setNewCollectionName(e.currentTarget.value)} />
        <button type="button" onClick={onCreateCollection}>add</button>
      </section>
      {(selectedCollection && apiKey) ? <section className='flex flex-col my-1'>
        <h2 className='my-1'>Add doc to {selectedCollection}</h2>
        <input placeholder='name' value={newDocName} onChange={(e) => setNewDocName(e.currentTarget.value)} />
        <textarea placeholder='content' value={newDocContent} onChange={(e) => setNewDocContent(e.currentTarget.value)} />
        <button type="button" onClick={onAddDocToCollection}>add</button>
      </section> : <p>Please add an api key and select a collection to add documents.</p>}
      <LoadingOverlay />
    </div>
  );
}

export default App;
