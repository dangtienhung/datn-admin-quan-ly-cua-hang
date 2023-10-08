import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { IDocSize, ISize } from '~/types'

export const sizeApi = createApi({
  reducerPath: 'sizeApi',

  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API }),

  tagTypes: ['Sizes'],

  endpoints: (builder) => ({
    /* Lấy ra tất cả topping */
    getAllSizes: builder.query<IDocSize, number | string>({
      query: (page) => `/sizes?_page=${page}`,
      providesTags: (result) =>
        result
          ? [...result.docs.map(({ _id }) => ({ type: 'Sizes', _id }) as const), { type: 'Sizes', _id: 'LIST' }]
          : [{ type: 'Sizes', id: 'LIST' }]
    }),

    /**Thêm mới size */
    addSize: builder.mutation({
      query: (size: ISize) => ({
        url: '/size',
        method: 'POST',
        body: size
      }),
      invalidatesTags: ['Sizes']
    }),

    /**Xóa size */
    deleteSize: builder.mutation({
      query: (id: string) => ({
        url: `/size/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Sizes']
    }),

    /**Cập nhật size */
    updateSize: builder.mutation({
      query: (size: ISize) => ({
        url: `/size/${size._id}`,
        method: 'PUT',
        body: { name: size.name, price: size.price }
      }),
      invalidatesTags: ['Sizes']
    })
  })
})

export const { useGetAllSizesQuery, useAddSizeMutation, useDeleteSizeMutation, useUpdateSizeMutation } = sizeApi