import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import './loading.css'
const Loading = () => {
  return (
    <div className='w-full h-[50vh] flex items-center justify-center'>
      <AiOutlineLoading3Quarters className={`text-5xl rotate font-bold  text-[#1D4ED8]`} />
    </div>
  )
}

export default Loading
