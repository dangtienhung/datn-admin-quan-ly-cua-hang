import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IUserDocs } from '~/types'

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getAllUser: builder.query<IUserDocs, void>({
      query: () => `/users?page=1`,
      providesTags: ['User']
    })
  })
})

export const { useGetAllUserQuery } = userApi
