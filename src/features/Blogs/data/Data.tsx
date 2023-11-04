import ListBlog from '../components/ListBlog/ListBlog'
import ListBlogActive from '../components/ListBlogActive'

export const items = [
  { key: '1', label: 'Blog đang hoạt động', children: <ListBlogActive /> },
  { key: '2', label: 'Tất cả blogs', children: <ListBlog /> }
]
