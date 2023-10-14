import { IImage } from '../Image'

export interface IBlogsDocs {
  docs: IBlogs[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
}
export interface IBlogs {
  _id: string
  name: string
  images: IImage[]
  description: string
  createdAt?: string
  updatedAt?: string
}