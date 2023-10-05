import { RouterProvider } from 'react-router-dom'

import routers from './routes/routes'
import './App.css'
import { useState } from 'react'
import { Loader } from './common'
import { pause } from './utils/pause'
const App = () => {
  const [isLoading, setIsLoading] = useState(true)
  pause(1000).then(() => {
    setIsLoading(false)
  })
  if (isLoading) return <Loader />
  return <RouterProvider router={routers} />
}

export default App
