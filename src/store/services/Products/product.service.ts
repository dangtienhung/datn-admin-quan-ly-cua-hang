import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { IProduct } from '~/types'
import { IProductDocs } from './../../../../../react-du-an-framework2/src/interfaces/products.type'

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API }),
  tagTypes: ['Product'],

  endpoints: (builder) => ({
    /* get all products */
    getAllProducts: builder.query<IProductDocs, { _page?: number; _limit?: number; query?: string }>({
      query: ({ _page, _limit, query }) => `/products/all?_page=${_page}&_limit=${_limit}0&query=${query}`,
      providesTags: (result) => {
        if (result) {
          const final = [
            ...result.docs.map(({ _id }) => ({ type: 'Product' as const, _id })),
            { type: 'Product' as const, id: 'LIST' }
          ]
          return final
        }
        return [{ type: 'Product', id: 'LIST' }]
      }
    }),

    /* get one */
    getOneProduct: builder.query<{ message: string; data: IProduct }, { id: string }>({
      query: ({ id }) => `post/${id}`,
      providesTags: (result, error, _id) => [{ type: 'Product', _id }]
    })
  })
})

export const { useGetAllProductsQuery, useGetOneProductQuery } = productApi
