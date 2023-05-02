import { useAbomiStore } from "../stores/store"

export const LoadingOverlay: React.FC = () => {
  const { loading } = useAbomiStore()
  return (loading ? <div className="h-screen w-screen absolute bg-gray-950/50">
    {loading}
  </div> : <></>)
}