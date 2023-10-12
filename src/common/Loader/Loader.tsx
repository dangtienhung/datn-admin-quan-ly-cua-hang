import { useColorMode } from '~/hooks'

const Loader = () => {
  const [colorMode] = useColorMode()
  return (
    <div className={`flex items-center justify-center h-screen ${colorMode === 'dark' ? 'bg-boxdark-2' : 'bg-white'}`}>
      <div className='animate-spin border-primary border-t-transparent w-16 h-16 border-4 border-solid rounded-full'></div>
    </div>
  )
}

export default Loader
