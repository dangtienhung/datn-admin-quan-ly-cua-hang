import './styles/GlobalStyles.css'

import App from './App.tsx'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import { store } from './store/store.ts'
import { ConfigProvider } from 'antd'
import vi_VN from 'antd/lib/locale/vi_VN'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <ConfigProvider locale={vi_VN}>
      <Toaster position='top-right' reverseOrder={false} containerClassName='overflow-auto' />
      <App />
    </ConfigProvider>
  </Provider>
)
