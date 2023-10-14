import { IBlogs } from './../../../types/Blogs/blog.type'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { IImage } from '~/types'

interface IBlogState {
  blogData: {
    _id?: string
    name: string
    images: IImage[]
    description: string
  }
}

const initialState: IBlogState = {
  blogData: {
    _id: '',
    name: '',
    description: '',
    images: []
  }
}

export const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    setBlog: (state, action: PayloadAction<IBlogs>) => {
      state.blogData = action.payload
    }
  }
})
export const { setBlog } = blogSlice.actions
export const blogReducer = blogSlice.reducer
