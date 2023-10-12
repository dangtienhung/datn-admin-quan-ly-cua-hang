import { productApi, toppingApi, VoucherApi } from './services'
import {
  categoryReducer,
  drawerReducers,
  toppingReducers,
  sizeReducers,
  voucherReducer,
  modalReducer,
  themeReducer
} from './slices'

import { configureStore } from '@reduxjs/toolkit'
import { productReducers } from './slices/Products/product.slice'
import { useDispatch } from 'react-redux'
import { userApi } from './services/Users'
import { categoryApi } from './services/Categories/category.service'
import { sizeApi } from './services/Sizes'
import { orderApi } from './services/Orders'
import { orderReducer } from './slices/Orders/order.slice'
import { AuthApi } from './services/Auth'

const middlewares = [
  toppingApi.middleware,
  userApi.middleware,
  categoryApi.middleware,
  sizeApi.middleware,
  productApi.middleware,
  orderApi.middleware,
  VoucherApi.middleware,
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
    vouchers: voucherReducer
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
