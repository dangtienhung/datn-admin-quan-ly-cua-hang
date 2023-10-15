import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import './loading.css'
type LoadingProps = {
  overlay?: boolean
}
const Loading = ({ overlay }: LoadingProps) => {
  return (
    <div
      className={`${
        overlay && 'bg-[#081e21] bg-opacity-40 dark:bg-opacity-60 fixed top-0 left-0 right-0 bottom-0 z-[99999]'
      } w-full ${overlay ? '' : 'h-[50vh]'}  flex items-center justify-center flex-col`}
    >
      <AiOutlineLoading3Quarters className={`text-5xl rotate font-bold  text-[#1D4ED8]`} />
      {overlay && <span className='text-white mt-4 text-base'>Vui lòng chờ...</span>}
    </div>
  )
}

export default Loading
