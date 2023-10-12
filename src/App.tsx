import { RouterProvider } from 'react-router-dom'

import routers from './routes/routes'
import './App.css'
import { useState } from 'react'
import { Loader } from './common'
import { pause } from './utils/pause'
import { ConfigProvider, theme } from 'antd'
import vi_VN from 'antd/lib/locale/vi_VN'
import { useAppSelector } from './store/hooks'
const App = () => {
  const { theme: currentTheme } = useAppSelector((state) => state.theme)
  const [isLoading, setIsLoading] = useState(true)
  pause(2000).then(() => {
    setIsLoading(false)
  })
  if (isLoading) return <Loader />
  return (
    <ConfigProvider
      locale={vi_VN}
      theme={{
        algorithm: currentTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm
      }}
    >
      <RouterProvider router={routers} />
    </ConfigProvider>
  )
}

export default App
