import { drawerReducers, sizeReducers, toppingReducers } from './slices'
import { sizeApi, toppingApi } from './services'

import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'

const middlewares = [toppingApi.middleware, sizeApi.middleware]

export const store = configureStore({
  reducer: {
    /* redux toolkit query */
    [toppingApi.reducerPath]: toppingApi.reducer,
    [sizeApi.reducerPath]: sizeApi.reducer,

    /* redux toolkit */
    drawer: drawerReducers,
    toppings: toppingReducers,
    sizes: sizeReducers
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
