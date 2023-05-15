import React, { useEffect, useState } from 'react'
import './App.css'
import { Input } from 'postcss'
import { useAlzaboStore } from './stores/store'
import classNames from 'classnames'
import { LoadingOverlay } from './components/LoadingOverlay'
import { Col, Row } from './components/RowCol'
import api from './api/index'
import { AskStages } from './constants/stages'
import { deyamlinate, ensteppen, testEnsteppen } from './utils/yaml'

function App() {
  const { activeTab, askStage, setActiveTab, ask, setAsk, llmAnswer, addDocumentToCollection, collections, createCollection, createEmbeddings, getCollections, getCollection, hasApiKey, init, loading, model, newEmbedding, queryCollection, queryResults, saveApiKey, selectedCollectionId, setSelectedCollectionId, setSelectedDocument, setAskStage, setHasApiKey, setLoading, setNewEmbedding, setQueryResults, tabs, updateDocument } = useAlzaboStore();
  const [initted, setInitted] = useState(false)
  const [editApiKey, setEditApiKey] = useState(false)
  const [newDocContent, setNewDocContent] = useState('')
  const [newDocName, setNewDocName] = useState('')
  const [newApiKey, setNewApiKey] = useState('')
  const [query, setQuery] = useState('')
  const [nResults,setNResults] = useState('5')
  const [newCollectionName, setNewCollectionName] = useState('')

  useEffect(() => {
    if (!initted) init()
    setInitted(true)

    getCollections()
    if (selectedCollectionId) {
      getCollection(selectedCollectionId)
    }

  }, [activeTab])

  useEffect(() => {
    if (selectedCollectionId) {
      getCollection(collections[selectedCollectionId].id)
    }
  }, [selectedCollectionId])

  const onAddDocToCollection = async () => {
    if (newEmbedding == null) { return alert('Get an embedding first') }
    try {
      await updateDocument(newDocName, newDocContent, newEmbedding, { sample: 'metadata' })
      // await addDocumentToCollection(collections[selectedCollectionId].id, newDocName, newDocContent, newEmbedding, { sample: 'metadata' })
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
    await queryCollection(selectedCollectionId, JSON.parse(query), nResults)
  }

  const onAsk = async () => {
    try { 
      setLoading('Fetching embeddings for your ask...')
      setAskStage(1)
      await createEmbeddings(ask)
    } catch (e) {
      alert('Error occurred while fetching embeddings: ' + JSON.stringify(e))
      setLoading('')
    }
  }

  const sxnCn = 'bg-gray-700 rounded-xl shadow border p-8 m-10'
  const btn = 'px-2 py-1 bg-gray-500 rounded hover:bg-cyan-100 hover:text-black disabled:pointer-events-none disabled:opacity-75 disabled:cursor-not-allowed'
  const ipt = 'px-2 bg-gray-800 rounded'
  const coll = collections?.[selectedCollectionId]
  testEnsteppen()

  return (
    <Col className='w-screen h-screen text-white bg-slate-800 overflow-y-auto pb-8'>
      <Col className='container mx-auto'>
        <header className='flex flex-row items-center p-8'>
          <img src='/alzabo64.png' className='rounded' />
          <h1 className='ml-4 text-4xl'> Alzabo </h1> 
          <Row className='mx-auto'>
            {tabs.map(tab => <Row key={tab}
                className={classNames('tab text-lg px-4 py-2 border-b-2', 
                  { 'text-cyan-500 border-cyan-500': tab === activeTab, 'border-transparent': tab !== activeTab })}>
              <button onClick={() => setActiveTab(tab)} className='px-2'>{tab}</button>
            </Row>)}
          </Row>
        </header>
        {llmAnswer && <Col className={classNames('my-1', sxnCn)}>
          <Row className='items-start'>
            <Col className='items-center'>
              <img src='/alzabo64.png' className='grayscale rounded' />
              <label className='my-2 font-mono text-sm'>"Al"</label>
            </Col>
            <textarea readOnly value={llmAnswer} rows={llmAnswer.split('\n').length} className={classNames(ipt, 'ml-2 py-2 px-4 font-mono rounded-xl resize-none rounded-tl-none')} />
            <textarea readOnly value={ensteppen(llmAnswer)} rows={llmAnswer.split('\n').length} className={classNames(ipt, 'ml-2 py-2 px-4 grow font-mono rounded-xl resize-none rounded-tl-none')} />
          </Row>
          <hr className='my-4' />
          <button className={classNames(btn, 'ml-auto')}>Execute plan</button>
        </Col>}
        {activeTab === 'build' && <Col className={classNames('my-1', sxnCn)}>
          <h2 className='mb-1 text-lg font-bold'>Build</h2>
          <p className='mb-1'>Tell Alzabo what you would like to do.</p>
          <Row>
            <textarea autoFocus className={classNames(ipt, 'grow self-stretch px-4 py-2')} value={ask} onChange={(e) => setAsk(e.currentTarget.value)} placeholder='Start a Pokur game and invite ~rus, ~dev, and ~tex.' />
            <button className={classNames(btn, 'px-4 relative font-mono font-bold text-xl !bg-cyan-600')} onClick={onAsk}>
              <span>{'>'}</span>
            </button>
          </Row>
          <Row className={classNames('mt-1 justify-center')}>
            {AskStages.map((stageName, stageIdx) => <Col key={stageName} className={classNames('items-center text-gray-400 px-0.5 mt-1', { '!text-cyan-700': askStage === stageIdx })}>
              <Row key={stageIdx} className={classNames('px-4 py-1 bg-gray-500 border', 
                  { 'border-cyan-200 text-cyan-200': askStage === stageIdx, 
                    '!bg-gray-700 border-gray-500': askStage < stageIdx,
                    'rounded-tl-xl rounded-bl-xl': stageIdx === 0,
                    'rounded-tr-xl rounded-br-xl': stageIdx === AskStages.length - 1 })}>
                {askStage > stageIdx ? '✔ ' : ''}{stageName}
              </Row>
            </Col>)}
          </Row>
        </Col>}
        {activeTab === 'settings' && <Col className={classNames('my-1', sxnCn)}>
          <h2 className='mb-1 text-lg font-bold'>Settings</h2>
          <Row>
            {(editApiKey || !hasApiKey) ? <Row>
              <input className={classNames(ipt)} placeholder='api key' value={newApiKey} onChange={(e) => setNewApiKey(e.currentTarget.value)} />
              <button className={classNames(btn, { 'cursor-not-allowed': Boolean(!newApiKey) })} disabled={!Boolean(newApiKey)} type='button' onClick={onSaveApiKey}>save</button>
            </Row> 
            : <button type='button' className={btn} onClick={() => setEditApiKey(true)}>edit API key</button>}
          </Row>
        </Col>}
        {activeTab === 'embeddings' && <>
          <Col className={classNames('my-1', sxnCn)}>
            <h2 className='mb-1 text-lg font-bold'>Collections</h2>
            {Object.keys(collections || {})?.length > 0 && <p>Select a collection:</p>}
            <Row className='flex-wrap items-center'>
              {Object.keys(collections).map(c => <Row 
                className={classNames('px-2 mr-5 text-black bg-cyan-100 cursor-pointer rounded collection hover:bg-cyan-200 hover:opacity-75', 
                  { 'text-white opacity-100 bg-cyan-600 font-bold': c === selectedCollectionId, 'opacity-50': c !== selectedCollectionId })} 
                key={c} 
                onClick={() => setSelectedCollectionId(c)}>
                  {collections[c].name}
              </Row>)}
              <Row>
                <input className={classNames(ipt)} placeholder='name' value={newCollectionName} onChange={(e) => setNewCollectionName(e.currentTarget.value)} />
                <button className={btn} type='button' onClick={onCreateCollection}>add</button>
              </Row>
            </Row>
          </Col>
          {selectedCollectionId && <Col className={classNames('my-1', sxnCn)}>
            <h2 className='mb-1 text-lg font-bold'>Query collection for nearest neighbors</h2>
            <Row>
              <Row>
                <Col>
                  <label>number of results</label>
                  <input className={classNames(ipt, 'mr-1')} value={nResults} onChange={(e) => setNResults(e.currentTarget.value)} placeholder='number of results' type='number' />
                </Col>
                <Col>
                  <label>query embeddings</label>
                  <textarea className={ipt} value={query} onChange={(e) => setQuery(e.currentTarget.value)} placeholder='query'/>
                </Col>
                <button className={classNames(btn)} type='button' onClick={onQuery}>Query</button>
              </Row>
            </Row>
          </Col>}
          {(selectedCollectionId && hasApiKey) && <Col className={classNames('my-1', sxnCn)}>
            <Row className='items-center'>
              <h2 className='rounded bg-cyan-600 px-2 mr-2 text-xl mb-1 font-bold font-mono'>{coll.name} </h2>
              <span className='text-xs'>{coll.id}</span>
            </Row>            
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
        </>}
        {activeTab === 'chat' && <>
          <Col className={classNames('my-1', sxnCn)}>
            <h2 className={classNames('mb-1 text-lg font-bold')}>Chat</h2>
            <p>Chat directly with {model}.</p>
          </Col>
        </>}
      </Col>
      <LoadingOverlay />
      <Row className={classNames('fixed left-4 bottom-4')}>
        <button className={classNames(btn, 'mr-4')} onClick={() => { setInitted(false); localStorage.clear(); sessionStorage.clear(); window.location.reload() }}>Reset UI</button>
      </Row>
    </Col>
  )
}

export default App
