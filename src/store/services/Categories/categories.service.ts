import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const categoriesApi = createApi({
  reducerPath: 'categoriesApi',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API }),
  tagTypes: ['categories'],

  endpoints: (builder) => ({
    /* get all categories */
    // getAllCategories: builder.query<I>
  })
})
