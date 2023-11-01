import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { IBlogs } from './../../../types/Blogs/blog.type'
import { IImage } from '~/types'

interface IBlogState {
  blogData: {
    _id?: string
    name: string
    images: IImage[]
    description: string
  }
  blogId: string | null
}

const initialState: IBlogState = {
  blogData: {
    _id: '',
    name: '',
    description: '',
    images: []
  },
  blogId: null
}

export const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    setBlog: (state, action: PayloadAction<IBlogs>) => {
      state.blogData = action.payload
    },
    setBlogId: (state, action: PayloadAction<string | null>) => {
      state.blogId = action.payload
    }
  }
})
export const { setBlog, setBlogId } = blogSlice.actions
export const blogReducer = blogSlice.reducer
