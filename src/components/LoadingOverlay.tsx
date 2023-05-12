import { useAlzaboStore } from '../stores/store'
import { Row } from './RowCol'

export const LoadingOverlay: React.FC = () => {
  const { loading } = useAlzaboStore()
  return (loading ? <div className='h-screen w-screen absolute bg-gray-950/50 flex flex-col items-center justify-center'>
    <div className='animate-spin w-10 h-10'>
      <svg width='20' height='20'>
        <circle cx='10' cy='10' r='5' fill='#fff'/>
      </svg>
    </div>
    <Row className='mt-5'>
      {loading}
    </Row>
  </div> : <></>) 
}