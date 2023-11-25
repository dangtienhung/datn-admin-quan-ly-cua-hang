import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IResImage, IUserDocs } from '~/types'

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getAllUser: builder.query<IUserDocs, void>({
      query: () => `/users?page=1`,
      providesTags: ['User']
    }),

    getAllUserByRole: builder.query<any, { limit: number; page: number; roleName: 'customer' | 'staff' }>({
      query: (options) => `/users/roles/${options.roleName}?_page=${options.page}&_limit=${options.limit}`,
      providesTags: ['User']
    }),

    addUser: builder.mutation<any, any>({
      query: (user) => ({
        url: '/users',
        method: 'POST',
        body: user
      }),
      invalidatesTags: ['User']
    }),

    updateUser: builder.mutation<any, any>({
      query: (user) => ({
        url: `/users/${user._id}`,
        method: 'PATCH',
        body: {
          username: user.username,
          gender: user.gender,
          role: user.role,
          avatar: user.avatar
        },
        credentials: 'include'
      }),
      invalidatesTags: ['User']
    }),

    deleteUser: builder.mutation({
      query: (id: string) => ({
        url: `/users/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['User']
    }),

    upLoadAvartaUser: builder.mutation<IResImage, FormData>({
      query: (file) => ({
        url: '/uploadImages',
        method: 'POST',
        body: file
      })
    })
  })
})

export const {
  useGetAllUserQuery,
  useAddUserMutation,
  useGetAllUserByRoleQuery,
  useUpLoadAvartaUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation
} = userApi
