import { categoryReducer, drawerReducers, sizeReducers, toppingReducers } from './slices'
import { productApi, toppingApi } from './services'

import { categoryApi } from './services/Categories/category.service'
import { configureStore } from '@reduxjs/toolkit'
import { productReducers } from './slices/Products/product.slice'
import { sizeApi } from './services/Sizes'
import { useDispatch } from 'react-redux'
import { userApi } from './services/Users'

const middlewares = [
  toppingApi.middleware,
  userApi.middleware,
  categoryApi.middleware,
  sizeApi.middleware,
  productApi.middleware
]

export const store = configureStore({
  reducer: {
    /* redux toolkit query */
    [toppingApi.reducerPath]: toppingApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [sizeApi.reducerPath]: sizeApi.reducer,
    [productApi.reducerPath]: productApi.reducer,

    /* redux toolkit */
    drawer: drawerReducers,
    toppings: toppingReducers,
    categories: categoryReducer,
    sizes: sizeReducers,
    products: productReducers
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
