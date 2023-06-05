import React, { useEffect, useState } from 'react'
import './App.css'
import { Input } from 'postcss'
import { useAlzaboStore } from './stores/alzaboStore'
import classNames from 'classnames'
import { LoadingOverlay } from './components/LoadingOverlay'
import { Col, Row } from './components/RowCol'
import api from './api/index'
import { AskStages } from './constants/stages'
import { deyamlinate, ensteppen, rose, testEnsteppen } from './utils/yaml'
import { SettingsTab } from './components/SettingsTab'
import { AppsByAction ,AppActionTypes } from './constants/actions'

function App() {
  const { activeTab, askStage, sxnCn, ipt, btn, newApiKey, editApiKey, setEditApiKey, setNewApiKey, setActiveTab, ask, setAsk, llmAnswer, addDocumentToCollection, collections, createCollection, createEmbeddings, getCollections, getCollection, hasApiKey, init, loading, model, newEmbedding, queryCollection, queryResults, saveApiKey, selectedCollectionId, setSelectedCollectionId, setSelectedDocument, setAskStage, setHasApiKey, setLoading, setNewEmbedding, setQueryResults, tabs, updateDocument } = useAlzaboStore();
  const [initted, setInitted] = useState(false)
  const [newDocContent, setNewDocContent] = useState('')
  const [newDocName, setNewDocName] = useState('')
  const [query, setQuery] = useState('')
  const [nResults,setNResults] = useState('5')
  const [newCollectionName, setNewCollectionName] = useState('')
  const [answerOverride, setAnswerOverride] = useState('')

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

  const onFetchEmbedding = async () => {
    setLoading('Fetching embedding...')
    await createEmbeddings(newDocContent)
    setLoading('')
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

  const onApprove = async (planSteps: any[][]) => {
    if (!window.confirm('Are you sure you want to approve this plan?')) return
    for (let i = 0; i < planSteps.length; i++) {
      const [stepType, step] = planSteps[i];
      // @ts-ignore
      const app = AppsByAction[stepType];
      // @ts-ignore
      const mark = AppActionTypes[AppsByAction[stepType]];
      setLoading(`Poking ${app} with ${stepType}...`);
      await api.poke({ app, mark, json: { [stepType]: step } });
    }
    setLoading('')

  }

  const isStepSus = (s: string) => {
    return s.indexOf('object Object') > 0
  }

  const coll = collections?.[selectedCollectionId]
  const answerToUse = answerOverride ? answerOverride : llmAnswer
  const steps = answerToUse ? ensteppen(answerToUse) : []
  // testEnsteppen()

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
        {activeTab === 'build' && <Col className={classNames('my-1', sxnCn)}>
          {answerToUse && <>
            <Row className='items-start'>
              <Col className='items-center'>
                <img src='/alzabo64.png' className='grayscale rounded' />
                <label className='my-2 font-mono text-sm'>"Al"</label>
              </Col>
              <Col className='grow'>
                <textarea value={answerToUse} 
                  rows={rose(answerToUse)} 
                  className={classNames(ipt, 'ml-2 py-2 px-4 text-xs font-mono rounded-xl resize-none rounded-tl-none')} 
                  onChange={(e) => setAnswerOverride(e.currentTarget.value)} />
                {answerOverride && <button className={classNames(btn, 'mx-auto mt-1 text-sm')} 
                  onClick={() => setAnswerOverride('')}>
                    Undo changes</button>}
                <textarea readOnly 
                  className={classNames(ipt, 'ml-2 py-2 px-4 grow text-xs font-mono rounded-xl resize-none mt-1 !bg-cyan-600')} 
                  value={`You can edit the above YAML to fine-tune parameters, or to produce a correct output in the event of an error by the AI.`}/>
              </Col>
              <Col className='grow self-stretch ml-2'>
                {steps.map(([stepType, step], i) => <Col key={i} className='step rounded-xl border bg-cyan-700 px-4 py-2 mb-2 relative'>
                  {isStepSus(JSON.stringify(step)) && <Row className='mb-2 px-2 rounded bg-rose-400'>
                    Possible errors detected.  <br/>
                    Unexpected output may result if plan executed.  <br/>
                    Recommended action: repeat query to Alzabo. <br/>
                  </Row>}
                  <Row className='rounded bg-gray-600 px-1 mb-1'>{i+1}. {stepType}</Row>
                  <textarea readOnly value={JSON.stringify(step, undefined, 2)} rows={rose(JSON.stringify(step, undefined, 2))} className={classNames(ipt, 'resize-none text-xs font-mono rounded-xl px-4 py-2')} />
                </Col>)}
              </Col>
            </Row>
            <Row>
            </Row>
            <button disabled={!!steps.find(([stepType, step]) => stepType === 'yaml-error')}
              onClick={() => onApprove(steps)} 
              className={classNames(btn, 'text-xl text-black !bg-cyan-200 ml-auto hover:!bg-gray-100 border border-black disabled:border-dashed')}>APPROVE & EXECUTE</button>
            <hr className='my-4' />
          </>}
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
                {askStage < stageIdx ? '🌕 ' : ''}
                {askStage === stageIdx ? '🌓 ' : ''}
                {askStage > stageIdx ? '🌑 ' : ''}
                {stageName}
              </Row>
            </Col>)}
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

            <Col className='mx-4 mb-4'>
              <h2 className='mb-2'>Add document</h2>
              <label>ID/name</label>
              <input className={classNames(ipt, 'mb-1')} placeholder='name' value={newDocName} onChange={(e) => setNewDocName(e.currentTarget.value)} />
              <label>Content</label>
              <textarea className={classNames(ipt, 'mb-1 font-mono')} placeholder='content' value={newDocContent} onChange={(e) => setNewDocContent(e.currentTarget.value)} />
              <label>Embedding</label>
              {newEmbedding && <textarea disabled className={classNames(ipt, 'mb-1 font-mono')} placeholder='embedding' value={JSON.stringify(newEmbedding)} />}
              {!newEmbedding && <button disabled={!newDocContent} className={classNames(btn)} onClick={onFetchEmbedding}>Fetch embedding ($)</button>}
              {newEmbedding && newDocContent && newDocName && <button disabled={!newEmbedding} className={classNames(btn)} type='button' onClick={onAddDocToCollection}>add</button>}
            </Col>
            
            {(coll.documents || []).map((doc, idx) => <Col key={idx} className='bg-gray-600 border rounded px-2 py-1 m-1 document'>
              <h4 className='ui-monospace text-md mb-1 font-bold font-mono'>{coll.ids[idx]}</h4>
              <span>embeddings: Array({coll.embeddings?.[idx]?.length})</span>
              <span>metadata: {JSON.stringify(coll.metadatas[idx])}</span>
              <span className='mb-1'>content:</span>
              <textarea disabled rows={3} className={classNames(ipt)} value={doc} />
            </Col>)}
          </Col>}
        </>}
        {activeTab === 'chat' && <>
          <Col className={classNames('my-1', sxnCn)}>
            <h2 className={classNames('mb-1 text-lg font-bold')}>Chat</h2>
            <p>Chat directly with {model}. (WIP)</p>
          </Col>
        </>}
        {/* {activeTab === 'settings' && <SettingsTab />} */}
        <SettingsTab />
      </Col>
      <LoadingOverlay />
      <Row className={classNames('fixed left-4 bottom-4')}>
        <button className={classNames(btn, 'mr-4')} onClick={() => { setInitted(false); localStorage.clear(); sessionStorage.clear(); window.location.reload() }}>Reset UI</button>
      </Row>
    </Col>
  )
}

export default App
