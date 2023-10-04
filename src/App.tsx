import { Dashboard, ToppingPage } from './pages'
import { Route, Routes } from 'react-router-dom'

import DefaultLayout from './layouts/DefaultLayout'
import { Loader } from './common'
import { Suspense } from 'react'
import routes from './routes'
import UserPage from './pages/UserPage'

const App = () => {
  return (
    <Routes>
      {/* <Route path='/auth/signin' element={<SignIn />} />
          <Route path='/auth/signup' element={<SignUp />} /> */}
      <Route element={<DefaultLayout />}>
        <Route index element={<Dashboard />} />
        {/* {routes.map(({ path, component: Component }) => (
          <Route
            key={path}
            path={path}
            element={
              <Suspense fallback={<Loader />}>
                <Component />
              </Suspense>
            }
          />
        ))} */}
        <Route path='/manager/toppings' element={<ToppingPage />} />
        <Route path='/manager/users' element={<UserPage />} />
      </Route>
    </Routes>
  )
}

export default App
