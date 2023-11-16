import ListBlog from '../components/ListBlog/ListBlog'
import ListBlogActive from '../components/ListBlogActive'
import ListBlogDeleted from '../components/ListBlogDeleted'

export const items = [
  { key: '1', label: 'Blog đang hoạt động', children: <ListBlogActive /> },
  { key: '2', label: 'Blog đã xóa', children: <ListBlogDeleted /> },
  { key: '3', label: 'Tất cả blogs', children: <ListBlog /> }
]
