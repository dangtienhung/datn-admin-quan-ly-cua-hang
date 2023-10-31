import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import {
  VoucherApi,
  blogApi,
  productApi,
  toppingApi,
  sizeApi,
  sliderApi,
  userApi,
  orderApi,
  categoryApi
} from './services'
import {
  blogReducer,
  categoryReducer,
  drawerReducers,
  modalReducer,
  sizeReducers,
  themeReducer,
  toppingReducers,
  voucherReducer,
  userReducer,
  authReducer
  // voucherReducer,
} from './slices'

import { AuthApi } from './services/Auth'
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { orderReducer } from './slices/Orders/order.slice'
import { productReducers } from './slices/Products/product.slice'
import { useDispatch } from 'react-redux'

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['auth']
}

const rootReducer = combineReducers({
  auth: authReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const middlewares = [
  toppingApi.middleware,
  userApi.middleware,
  categoryApi.middleware,
  sizeApi.middleware,
  productApi.middleware,
  orderApi.middleware,
  VoucherApi.middleware,
  blogApi.middleware,
  AuthApi.middleware,
  sliderApi.middleware
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
    [sliderApi.reducerPath]: sliderApi.reducer,

    /* redux toolkit */
    persistedReducer,
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
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    }).concat(...middlewares)
})

export const persistor = persistStore(store)
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
