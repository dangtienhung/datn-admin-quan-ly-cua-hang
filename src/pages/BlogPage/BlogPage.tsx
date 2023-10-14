import { useGetAllBlogsQuery } from '~/store/services'
import { NotFound } from '..'
import Loading from '~/components/Loading/Loading'
import BlogFeature from '~/features/Blogs/Blogs'

const BlogPage = () => {
  const { isError: errorBlog, isFetching: fetchingBlog, data: blogData } = useGetAllBlogsQuery(0)
  // console.log(blogData)

  if (errorBlog || !blogData) {
    return <NotFound />
  }
  if (fetchingBlog) {
    return <Loading />
  }
  return (
    <>
      <BlogFeature data={blogData.docs} />
    </>
  )
}
export default BlogPage
