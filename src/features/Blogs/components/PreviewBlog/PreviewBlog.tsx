import { RootState, useAppDispatch } from '~/store/store'
import { setBlogId, setOpenDrawer } from '~/store/slices'
import { useEffect, useState } from 'react'

import { Drawer } from 'antd'
import parse from 'html-react-parser'
import { useAppSelector } from '~/store/hooks'
import { useGetBlogQuery } from '~/store/services'

export const PreviewBlog = () => {
  const dispatch = useAppDispatch()
  const [idBlog, setIdBlog] = useState<string>('' as string)
  const { openDrawer } = useAppSelector((state: RootState) => state.drawer)
  const { blogId } = useAppSelector((state: RootState) => state.blogs)

  const { data: blogDetail } = useGetBlogQuery(idBlog)

  useEffect(() => {
    if (blogId) {
      setIdBlog(blogId)
    }
  }, [blogId])

  if (!blogId) return null
  if (!blogDetail || Array.isArray(blogDetail)) return null

  return (
    <Drawer
      title='Thông tin bài viết'
      placement='right'
      width={720}
      onClose={() => {
        dispatch(setOpenDrawer(false))
        dispatch(setBlogId(null))
      }}
      open={openDrawer && blogId ? true : false}
    >
      <div className='flex flex-col gap-4'>
        <h2 className='text-2xl capitalize'>{blogDetail?.name}</h2>

        <img
          src={blogDetail?.images[0]?.url}
          alt={blogDetail?.images[0]?.filename}
          className='h-[350px] w-[600px] mx-auto shadow-1 object-cover rounded-lg'
        />

        <div className=''>{parse(blogDetail?.description || '')}</div>
      </div>
    </Drawer>
  )
}
