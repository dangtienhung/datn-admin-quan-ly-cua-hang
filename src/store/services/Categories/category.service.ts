import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ICategoryDocs } from '~/types'

export const categoryApi = createApi({
  reducerPath: 'categoryApi',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API }),
  tagTypes: ['Category'],
  endpoints: (builder) => ({
    getAllCategory: builder.query<ICategoryDocs, void>({
      query: () => `/categories`,
      providesTags: ['Category']
    }),

    deleteCategory: builder.mutation({
      query: (id: string) => ({
        url: `/category/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Category']
    }),

    addCategory: builder.mutation({
      query: (category: { name: string }) => ({
        url: '/category',
        method: 'POST',
        body: category
      }),
      invalidatesTags: ['Category']
    }),

    updateCategory: builder.mutation({
      query: (category: { _id: string; name: string }) => ({
        url: `/category/${category._id}`,
        method: 'PUT',
        body: { name: category.name }
      }),
      invalidatesTags: ['Category']
    })
  })
})

export const { useGetAllCategoryQuery, useDeleteCategoryMutation, useAddCategoryMutation, useUpdateCategoryMutation } =
  categoryApi
