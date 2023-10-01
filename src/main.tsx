import './styles/GlobalStyles.css'

import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import { store } from './store/store.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Provider store={store}>
      <Toaster position='top-right' reverseOrder={false} containerClassName='overflow-auto' />
      <App />
    </Provider>
  </BrowserRouter>
)
