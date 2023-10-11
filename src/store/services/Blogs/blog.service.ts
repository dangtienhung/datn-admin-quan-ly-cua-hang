import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IBlogsDocs } from '~/types'

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
    })
  })
})

export const { useGetAllBlogsQuery } = blogApi
