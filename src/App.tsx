import React, { useEffect, useState } from 'react'
import './App.css'
import { Input } from 'postcss'
import { useAlzaboStore } from './stores/store'
import classNames from 'classnames'
import { LoadingOverlay } from './components/LoadingOverlay'
import { Col, Row } from './components/RowCol'
import { api } from './api/api'

function App() {
  const { init, saveApiKey, hasApiKey, setHasApiKey, collections, addDocumentToCollection, queryCollection, getCollection, createCollection, getCollections } = useAlzaboStore()
  const [initted, setInitted] = useState(false)
  const [editApiKey, setEditApiKey] = useState(false)
  const [newDocContent, setNewDocContent] = useState('')
  const [newDocName, setNewDocName] = useState('')
  const [selectedCollection, setSelectedCollection] = useState('')
  const [newApiKey, setNewApiKey] = useState('')
  const [newCollectionName, setNewCollectionName] = useState('')

  useEffect(() => {
    if (!initted) init()
    setInitted(true)
    // getCollections()
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

  const onSaveApiKey = async () => {
    saveApiKey(newApiKey)
    if (!await api.scry({ app: 'alzabo', path: '/has-api-key' })) return
    setNewApiKey('')
    setHasApiKey(true)
    setEditApiKey(false)
  }

  const sxnCn = 'bg-gray-200 dark:bg-gray-700 rounded-xl shadow border p-8 m-10'
  const btn = 'hover:bg-cyan-100 hover:text-black px-2 py-1 bg-black-500 dark:bg-gray-500 rounded'

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
            {(editApiKey || !hasApiKey) ? <Row>
              <input className='px-2 dark:bg-gray-800' placeholder='api key' value={newApiKey} onChange={(e) => setNewApiKey(e.currentTarget.value)} />
              <button className={classNames(btn, { 'cursor-not-allowed': Boolean(!newApiKey) })} disabled={!Boolean(newApiKey)} type='button' onClick={onSaveApiKey}>save</button>
            </Row> 
            : <button type='button' className={btn} onClick={() => setEditApiKey(true)}>edit API key</button>}
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
            <input className='px-2 dark:bg-gray-800' placeholder='name' value={newCollectionName} onChange={(e) => setNewCollectionName(e.currentTarget.value)} />
            <button className={btn} type='button' onClick={onCreateCollection}>add</button>
          </Row>
        </Col>
        {(selectedCollection && hasApiKey) && <Col className={classNames('my-1', sxnCn)} >
          <h2 className='mb-1'>Add doc to {selectedCollection}</h2>
          <input className='px-2 dark:bg-gray-800' placeholder='name' value={newDocName} onChange={(e) => setNewDocName(e.currentTarget.value)} />
          <textarea placeholder='content' value={newDocContent} onChange={(e) => setNewDocContent(e.currentTarget.value)} />
          <button className={btn} type='button' onClick={onAddDocToCollection}>add</button>
        </Col>}
      </Col>
      <LoadingOverlay />
      <button className={classNames(btn, 'fixed p-2 rounded left-4 bottom-4')} onClick={() => { setInitted(false); localStorage.clear(); sessionStorage.clear(); window.location.reload() }}>Reset UI</button>
    </Col>
  )
}

export default App
