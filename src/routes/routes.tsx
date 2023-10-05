import { CategoryPage, Dashboard, NotFound, ProductPage, SizePage, ToppingPage } from '~/pages'

import DefaultLayout from '~/layouts/DefaultLayout'
import { createBrowserRouter } from 'react-router-dom'

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
          { path: 'products', element: <ProductPage /> },
          { path: 'sizes', element: <SizePage /> },
          { path: 'users', element: '<Users />' },
          { path: 'vouchers', element: '<vouchers />' },
          { path: 'categories', element: <CategoryPage /> },
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
