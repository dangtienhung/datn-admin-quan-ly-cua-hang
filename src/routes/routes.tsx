import {
  CategoryPage,
  Dashboard,
  NotFound,
  OrderPage,
  ProductPage,
  SizePage,
  StaffPage,
  ToppingPage,
  VoucherPage
} from '~/pages'
import DefaultLayout from '~/layouts/DefaultLayout'
import CustomerPage from '~/pages/CustomerPage'
import { createBrowserRouter } from 'react-router-dom'
import SignIn from '~/pages/SignIn'

const routers = createBrowserRouter([
  {
    path: '/',
    element: <SignIn />
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
          { path: 'customers', element: <CustomerPage /> },
          { path: 'staffs', element: <StaffPage /> },
          { path: 'vouchers', element: <VoucherPage /> },
          { path: 'categories', element: <CategoryPage /> },
          { path: 'orders', element: <OrderPage /> }
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
