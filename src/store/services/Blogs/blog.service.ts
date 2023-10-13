import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IBlogs, IBlogsDocs } from '~/types'

export const blogApi = createApi({
  reducerPath: 'blogApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API
  }),
  tagTypes: ['Blogs'],
  endpoints: (builder) => ({
    getAllBlogs: builder.query<IBlogsDocs, number | string>({
      query: () => `/newsBlog`,
      providesTags: (result) => {
        if (result) {
          const final = [
            ...result.docs.map(({ _id }) => ({ type: 'Blogs' as const, _id })),
            { type: 'Blogs' as const, id: 'LIST' }
          ]
          return final
        }
        return [{ type: 'Blogs', id: 'LIST' }]
      }
    }),
    deleteBlog: builder.mutation<IBlogs, { id: string }>({
      query: ({ id }) => ({
        url: `/newsBlog-remove/${id}`,
        method: 'DElETE'
      }),
      invalidatesTags: [{ type: 'Blogs', id: 'LIST' }]
    }),
    addBlog: builder.mutation<IBlogs, Partial<IBlogs>>({
      query(body) {
        return {
          url: `/create-newsBlog`,
          method: 'POST',
          body
        }
      },
      invalidatesTags: [{ type: 'Blogs', id: 'LIST' }]
    }),
    updateBlog: builder.mutation<IBlogs, Partial<IBlogs>>({
      query(data) {
        const { _id, ...body } = data
        return {
          url: `/newsBlog/${_id}`,
          method: 'PUT',
          body
        }
      },
      invalidatesTags: (_, __, { _id }) => [{ type: 'Blogs', _id }]
    })
  })
})

export const { useGetAllBlogsQuery, useAddBlogMutation, useDeleteBlogMutation, useUpdateBlogMutation } = blogApi
