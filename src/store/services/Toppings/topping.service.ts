import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { IDocsToppings } from '~/types'

export const toppingApi = createApi({
  reducerPath: 'toppingApi',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API }),
  tagTypes: ['Topping'],
  endpoints: (builder) => ({
    /* Lấy ra tất cả topping */
    getAllToppings: builder.query<IDocsToppings, void>({
      query: () => `/toppings`,
      providesTags: (result) => {
        if (result) {
          const final = [
            ...result.data.map(({ _id }) => ({ type: 'Topping' as const, _id })),
            { type: 'Topping' as const, id: 'LIST' }
          ]
          return final
        }
        return [{ type: 'Topping', id: 'LIST' }]
      }
    }),

    /* delete topping */
    deleteTopping: builder.mutation({
      query: (id: string) => ({
        url: `/topping/${id}`,
        method: 'DElETE'
      }),
      invalidatesTags: (_, __, id) => [{ type: 'Topping', id }]
    })
  })
})

export const { useGetAllToppingsQuery, useDeleteToppingMutation } = toppingApi
