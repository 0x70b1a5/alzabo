import classNames from 'classnames'
import { Col, Row } from './RowCol'
import { useAlzaboStore } from '../stores/alzaboStore'
import api from '../api'  

export const SettingsTab : React.FC = () => {
  const { activeTab, askStage, temperature, setTemperature, models, setModels, setModel, newApiKey, editApiKey, sxnCn, ipt, btn, setEditApiKey, setNewApiKey, setActiveTab, ask, setAsk, llmAnswer, addDocumentToCollection, collections, createCollection, createEmbeddings, getCollections, getCollection, hasApiKey, init, loading, model, newEmbedding, queryCollection, queryResults, saveApiKey, selectedCollectionId, setSelectedCollectionId, setSelectedDocument, setAskStage, setHasApiKey, setLoading, setNewEmbedding, setQueryResults, tabs, updateDocument } = useAlzaboStore()
  
  const onSaveApiKey = async () => {
    saveApiKey(newApiKey)
    if (!await api.scry({ app: 'alzabo', path: '/has-api-key' })) return
    setNewApiKey('')
    setHasApiKey(true)
    setEditApiKey(false)
  }
  
  return ( <Col className={classNames('my-1', sxnCn)}>
    <h2 className='mb-1 text-lg font-bold'>Settings</h2>
    <Row className='mb-1'>
      <strong className='mr-2'>API Key</strong>
      {(editApiKey || !hasApiKey) ? <Row>
        <input className={classNames(ipt)} placeholder='api key' value={newApiKey} onChange={(e) => setNewApiKey(e.currentTarget.value)} />
        <button className={classNames(btn, { 'cursor-not-allowed': Boolean(!newApiKey) })} disabled={!Boolean(newApiKey)} type='button' onClick={onSaveApiKey}>save</button>
      </Row> 
      : <>
        <Row className='mr-1'>✅</Row>
        <button type='button' className={classNames(btn, 'text-xs')} onClick={() => setEditApiKey(true)}>edit</button>
      </>}
    </Row>
    <Row className='mb-1'>
      <strong className='mr-2'>Model</strong>
      <input className={classNames(ipt)} placeholder='model' value={model} onChange={(e) => setModel(e.currentTarget.value)} />
    </Row>
    <Row className='mb-1'>
      <strong className='mr-2'>Temperature</strong>
      <input className={classNames(ipt)} placeholder='temperature' value={temperature} onChange={(e) => setTemperature(+e.currentTarget.value)} />
    </Row>
  </Col>)
}