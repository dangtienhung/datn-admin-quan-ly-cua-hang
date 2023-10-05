import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { IDocSize } from '~/types'

export const sizeApi = createApi({
  reducerPath: 'sizeApi',

  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API }),

  tagTypes: ['Sizes'],

  endpoints: (builder) => ({
    /* Lấy ra tất cả topping */
    getAllSizes: builder.query<IDocSize, void>({
      query: () => `/sizes`,
      providesTags: (result) =>
        result
          ? [...result.docs.map(({ _id }) => ({ type: 'Sizes', _id }) as const), { type: 'Sizes', _id: 'LIST' }]
          : [{ type: 'Sizes', id: 'LIST' }]
    })
  })
})

export const { useGetAllSizesQuery } = sizeApi
