import React, { useEffect, useState } from 'react'
import './App.css'
import { Input } from 'postcss'
import { useAlzaboStore } from './stores/store'
import classNames from 'classnames'
import { LoadingOverlay } from './components/LoadingOverlay'
import { Col, Row } from './components/RowCol'
import api from './api/index'

function App() {
  const { init, saveApiKey, hasApiKey, setHasApiKey, newEmbedding, setNewEmbedding, createEmbeddings, setSelectedDocument, collections, selectedCollectionId, setSelectedCollectionId, addDocumentToCollection, queryCollection, getCollection, createCollection, getCollections } = useAlzaboStore()
  const [initted, setInitted] = useState(false)
  const [editApiKey, setEditApiKey] = useState(false)
  const [newDocContent, setNewDocContent] = useState('')
  const [newDocName, setNewDocName] = useState('')
  const [newApiKey, setNewApiKey] = useState('')
  const [query, setQuery] = useState('')
  const [newCollectionName, setNewCollectionName] = useState('')

  useEffect(() => {
    if (!initted) init()
    setInitted(true)
    getCollections()
  }, [])

  useEffect(() => {
    if (selectedCollectionId) {
      getCollection(collections[selectedCollectionId].id)
    }
  }, [selectedCollectionId])

  const onAddDocToCollection = async () => {
    if (newEmbedding == null) { return alert('Get an embedding first') }
    try {
      await addDocumentToCollection(collections[selectedCollectionId].id, newDocName, newDocContent, newEmbedding, { sample: 'metadata' })
      setNewDocContent('')
      setNewDocName('')
      setNewEmbedding(null)
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

  const onFetchEmbedding = async () => {
    await createEmbeddings(newDocContent)
  }

  const onQuery = async () => {
    await queryCollection(selectedCollectionId, JSON.parse(query))
  }

  const sxnCn = 'bg-gray-700 rounded-xl shadow border p-8 m-10'
  const btn = 'px-2 py-1 bg-gray-500 rounded hover:bg-cyan-100 hover:text-black disabled:pointer-events-none disabled:opacity-75 disabled:cursor-not-allowed'
  const ipt = 'px-2 bg-gray-800 rounded'
  const coll = collections?.[selectedCollectionId]

  return (
    <Col className='w-screen h-screen text-white bg-slate-800 overflow-y-auto pb-8'>
      <Col className='container mx-auto'>
        <header className='flex flex-row items-center p-8'>
          <img src='/alzabo64.png' />
          <h1 className='ml-4 text-4xl'> Alzabo </h1> 
        </header>
        <Col className={classNames('my-1', sxnCn)}>
          <h2 className='mb-1'>Settings</h2>
          <Row>
            {(editApiKey || !hasApiKey) ? <Row>
              <input className={classNames(ipt)} placeholder='api key' value={newApiKey} onChange={(e) => setNewApiKey(e.currentTarget.value)} />
              <button className={classNames(btn, { 'cursor-not-allowed': Boolean(!newApiKey) })} disabled={!Boolean(newApiKey)} type='button' onClick={onSaveApiKey}>save</button>
            </Row> 
            : <button type='button' className={btn} onClick={() => setEditApiKey(true)}>edit API key</button>}
          </Row>
        </Col>
        <Col className={classNames('my-1', sxnCn)}>
          <h2 className='mb-1'>Collections</h2>
          {Object.keys(collections || {})?.length > 0 && <p>Select a collection:</p>}
          <Row className='flex-wrap ml-5'>
            {Object.keys(collections).map(c => <Row 
              className={classNames('p-2 mr-5 text-black bg-cyan-100 cursor-pointer rounded collection hover:bg-cyan-200 hover:opacity-75', 
                { 'text-white opacity-100 bg-cyan-500': c === selectedCollectionId, 'opacity-50': c !== selectedCollectionId })} 
              key={c} 
              onClick={() => setSelectedCollectionId(c)}>
                {collections[c].name}
            </Row>)}
            <Row className='my-1'>
              <input className={classNames(ipt)} placeholder='name' value={newCollectionName} onChange={(e) => setNewCollectionName(e.currentTarget.value)} />
              <button className={btn} type='button' onClick={onCreateCollection}>add</button>
            </Row>
          </Row>
        </Col>
        {selectedCollectionId && <Col className={classNames('my-1', sxnCn)}>
          <h2 className='mb-1'>Query collection for nearest neighbors</h2>
          <Row>
            <textarea className={ipt} value={query} onChange={(e) => setQuery(e.currentTarget.value)} placeholder='query'/>
            <button className={classNames(btn)} type='button' onClick={onQuery}>Query</button>
          </Row>
        </Col>}
        {(selectedCollectionId && hasApiKey) && <Col className={classNames('my-1', sxnCn)}>
          <h2 className='text-xl mb-1 font-bold font-mono'>{coll.name}</h2>
          <h3 className='text-lg'>documents</h3>
          {(coll.documents || []).map((doc, idx) => <Col key={idx} className='bg-gray-600 border rounded px-2 py-1 m-1 document'>
            <h4 className='ui-monospace text-md mb-1 font-bold font-mono'>{coll.ids[idx]}</h4>
            <span>embeddings: Array({coll.embeddings?.[idx]?.length})</span>
            <span>metadata: {JSON.stringify(coll.metadatas[idx])}</span>
            <span className='mb-1'>content:</span>
            <textarea disabled rows={3} className={classNames(ipt)} value={doc} />
          </Col>)}
          <h2 className='mt-4 mb-2'>Add document</h2>
          <label>ID/name</label>
          <input className={classNames(ipt, 'mb-1')} placeholder='name' value={newDocName} onChange={(e) => setNewDocName(e.currentTarget.value)} />
          <label>Content</label>
          <textarea className={classNames(ipt, 'mb-1 font-mono')} placeholder='content' value={newDocContent} onChange={(e) => setNewDocContent(e.currentTarget.value)} />
          <label>Embedding</label>
          {newEmbedding && <textarea disabled className={classNames(ipt, 'mb-1 font-mono')} placeholder='embedding' value={JSON.stringify(newEmbedding)} />}
          {!newEmbedding && <button disabled={!newDocContent} className={classNames(btn)} onClick={onFetchEmbedding}>Fetch embedding ($)</button>}
          {newEmbedding && newDocContent && newDocName && <button disabled={!newEmbedding} className={classNames(btn)} type='button' onClick={onAddDocToCollection}>add</button>}
        </Col>}
      </Col>
      <LoadingOverlay />
      <button className={classNames(btn, 'fixed left-4 bottom-4')} onClick={() => { setInitted(false); localStorage.clear(); sessionStorage.clear(); window.location.reload() }}>Reset UI</button>
    </Col>
  )
}

export default App
