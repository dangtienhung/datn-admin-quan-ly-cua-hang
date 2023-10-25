import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Login } from '~/pages/SignIn/validate'

export const AuthApi = createApi({
  reducerPath: 'AuthApi',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API }),
  tagTypes: ['AuthApi'],
  endpoints: (builder) => ({
    signIn: builder.mutation<void, Login>({
      query: ({ ...rest }) => ({
        url: '/login',
        body: rest,
        method: 'POST',
        credentials: 'include'
      })
    })
  })
})

export const { useSignInMutation } = AuthApi
