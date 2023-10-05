import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API }),
  tagTypes: ['Product'],

  endpoints: (builder) => ({
    /* get all products */
    // getAllProducts: builder.query<IDoc
  })
})
