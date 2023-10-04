import { createBrowserRouter } from 'react-router-dom'
import DefaultLayout from '~/layouts/DefaultLayout'
import { Dashboard, NotFound, ToppingPage } from '~/pages'

const routers = createBrowserRouter([
  {
    path: '/',
    element: 'Login'
  },
  {
    path: '/dashboard',
    children: [
      {
        element: <DefaultLayout />,
        children: [{ index: true, element: <Dashboard /> }]
      }
    ]
  },
  {
    path: '/manager',
    children: [
      {
        element: <DefaultLayout />,
        children: [
          { path: 'toppings', element: <ToppingPage /> },
          { path: 'products', element: '<Products />' },
          { path: 'users', element: '<Users />' },
          { path: 'vouchers', element: '<vouchers />' },
          { path: 'categories', element: '<categories />' },
          { path: 'orders', element: '<orders />' }
        ]
      }
    ]
  },
  {
    path: '/settings',
    children: [
      {
        element: <DefaultLayout />,
        children: [{ index: true, element: 'settings' }]
      }
    ]
  },
  {
    path: '*',
    element: <NotFound />
  }
])

export default routers
