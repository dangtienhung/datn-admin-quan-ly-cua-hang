import {
  CategoryPage,
  Dashboard,
  NotFound,
  OrderPage,
  ProductPage,
  SizePage,
  StaffPage,
  ToppingPage,
  VoucherPage,
  CustomerPage,
  SliderPage
} from '~/pages'
import DefaultLayout from '~/layouts/DefaultLayout'
import { createBrowserRouter } from 'react-router-dom'
import BlogPage from '~/pages/BlogPage'
import SignIn from '~/pages/SignIn'
import { GuardAccount } from '.'
import CategoryBlogPage from '~/pages/CategoryBlogPage'

const routers = createBrowserRouter([
  {
    path: '/',
    element: <SignIn />
  },
  {
    path: '/dashboard',
    children: [
      {
        element: <GuardAccount JSX={DefaultLayout} />,
        children: [{ index: true, element: <Dashboard /> }]
      }
    ]
  },
  {
    path: '/manager',
    children: [
      {
        element: <GuardAccount JSX={DefaultLayout} />,
        children: [
          { path: 'toppings', element: <ToppingPage /> },
          { path: 'products', element: <ProductPage /> },
          { path: 'sizes', element: <SizePage /> },
          { path: 'customers', element: <CustomerPage /> },
          { path: 'staffs', element: <StaffPage /> },
          { path: 'vouchers', element: <VoucherPage /> },
          { path: 'categories', element: <CategoryPage /> },
          { path: 'orders', element: <OrderPage /> },
          { path: 'category-blog', element: <CategoryBlogPage /> },
          { path: 'blogs', element: <BlogPage /> },
          { path: 'sliders', element: <SliderPage /> }
        ]
      }
    ]
  },
  {
    path: '/settings',
    children: [
      {
        element: <GuardAccount JSX={DefaultLayout} />,
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
