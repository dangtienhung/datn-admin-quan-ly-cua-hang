// import { Dashboard } from '~/pages'

import { lazy } from 'react'

const Dashboard = lazy(() => import('../pages/Dashboard/Dashboard'))
const ProductPage = lazy(() => import('../pages/ProductPage/ProductPage'))
const ToppingPage = lazy(() => import('../pages/ToppingPage/ToppingPage'))

const coreRoutes = [
  {
    path: '/',
    title: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/manager/products',
    title: 'Products',
    component: ProductPage
  },
  {
    path: '/manager/toppings',
    title: 'Products',
    component: ToppingPage
  }
]

const routes = [...coreRoutes]
export default routes
