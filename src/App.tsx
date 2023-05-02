import React, { useEffect, useState } from 'react'
import './App.css'
import { Input } from 'postcss'
import { useAbomiStore } from './stores/store'
import classNames from 'classnames'
import { LoadingOverlay } from './components/LoadingOverlay'
import { Col, Row } from './components/RowCol'

function App() {
  const { init, saveApiKey, apiKey, collections, addDocumentToCollection, queryCollection, getCollection, createCollection, getCollections } = useAbomiStore()
  const [initted, setInitted] = useState(false)
  const [newDocContent, setNewDocContent] = useState('')
  const [newDocName, setNewDocName] = useState('')
  const [selectedCollection, setSelectedCollection] = useState('')
  const [newApiKey, setNewApiKey] = useState('')
  const [newCollectionName, setNewCollectionName] = useState('')

  useEffect(() => {
    init()
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

  const sxnCn = 'bg-gray-200 dark:bg-gray-700 rounded-xl shadow border p-8 m-10'

  return (
    <Col className='w-screen h-screen dark bg-white text-slate-900 dark:text-white dark:bg-slate-800'>
      <Col className='container mx-auto'>
        <header className='flex flex-row items-center p-8'>
          <img src='/alzabo64.png' />
          <h1 className='ml-4 text-4xl'> Alzabo </h1> 
        </header>
        <Col className={classNames('my-1', sxnCn)}>
          <h2 className='mb-1'>Settings</h2>
          <Row>
            <input placeholder='api key' value={newApiKey} onChange={(e) => setNewApiKey(e.currentTarget.value)} />
            <button className={classNames('hover:font-bold px-2 py-1', { 'cursor-not-allowed': Boolean(!apiKey) })} disabled={!Boolean(newApiKey)} type='button' onClick={() => {saveApiKey(newApiKey)}}>save</button>
          </Row>
        </Col>
        {collections.length > 0 && <Col className={classNames('my-1', sxnCn)}>
          <h2 className='mb-1'>Collections</h2>
          <p>Select a collection to add documents to:</p>
          <Row className='ml-5'>
            {Object.keys(collections).map(c => <Row className={classNames('p-2 mr-5 bg-lime-100 cursor-pointer rounded collection hover:bg-lime-500', { 'text-white': c === selectedCollection,  'bg-lime-900': c === selectedCollection })} key={c} 
            onClick={() => setSelectedCollection(c)}>
              <h3>{c}</h3>
            </Row>)}
          </Row>
        </Col>}
        <Col className={classNames('my-1', sxnCn)}>
          <h2 className='mb-1'>Add collection</h2>
          <Row>
            <input placeholder='name' value={newCollectionName} onChange={(e) => setNewCollectionName(e.currentTarget.value)} />
            <button className='hover:font-bold px-2 py-1' type='button' onClick={onCreateCollection}>add</button>
          </Row>
        </Col>
        {(selectedCollection && apiKey) && <Col className={classNames('my-1', sxnCn)} >
          <h2 className='mb-1'>Add doc to {selectedCollection}</h2>
          <input placeholder='name' value={newDocName} onChange={(e) => setNewDocName(e.currentTarget.value)} />
          <textarea placeholder='content' value={newDocContent} onChange={(e) => setNewDocContent(e.currentTarget.value)} />
          <button className='hover:font-bold px-2 py-1' type='button' onClick={onAddDocToCollection}>add</button>
        </Col>}
      </Col>
      <LoadingOverlay />
    </Col>
  )
}

export default App
