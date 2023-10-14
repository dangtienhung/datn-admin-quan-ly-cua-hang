import { VoucherApi, blogApi, productApi, toppingApi } from './services'
import {
  blogReducer,
  categoryReducer,
  drawerReducers,
  modalReducer,
  sizeReducers,
  themeReducer,
  toppingReducers,
  voucherReducer
} from './slices'

import { AuthApi } from './services/Auth'
import { categoryApi } from './services/Categories/category.service'
import { configureStore } from '@reduxjs/toolkit'
import { orderApi } from './services/Orders'
import { orderReducer } from './slices/Orders/order.slice'
import { productReducers } from './slices/Products/product.slice'
import { sizeApi } from './services/Sizes'
import { useDispatch } from 'react-redux'
import { userApi } from './services/Users'
import { userReducer } from './slices/User/user.slice'

const middlewares = [
  toppingApi.middleware,
  userApi.middleware,
  categoryApi.middleware,
  sizeApi.middleware,
  productApi.middleware,
  orderApi.middleware,
  VoucherApi.middleware,
  blogApi.middleware,
  AuthApi.middleware
]

export const store = configureStore({
  reducer: {
    /* redux toolkit query */
    [toppingApi.reducerPath]: toppingApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [sizeApi.reducerPath]: sizeApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [VoucherApi.reducerPath]: VoucherApi.reducer,
    [blogApi.reducerPath]: blogApi.reducer,
    [AuthApi.reducerPath]: AuthApi.reducer,

    /* redux toolkit */
    drawer: drawerReducers,
    modal: modalReducer,
    theme: themeReducer,
    toppings: toppingReducers,
    categories: categoryReducer,
    sizes: sizeReducers,
    products: productReducers,
    orders: orderReducer,
    vouchers: voucherReducer,
    blogs: blogReducer,
    user: userReducer
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(...middlewares)
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
