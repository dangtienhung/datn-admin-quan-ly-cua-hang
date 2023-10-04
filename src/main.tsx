import './styles/GlobalStyles.css'

import App from './App.tsx'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import { store } from './store/store.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <Toaster position='top-right' reverseOrder={false} containerClassName='overflow-auto' />
    <App />
  </Provider>
)
