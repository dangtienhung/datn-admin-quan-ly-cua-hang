import { Breadcrumb, Button, PlusIcon } from '~/components'
import { IBlogs, IRoleUser } from '~/types'
import { RootState, useAppDispatch } from '~/store/store'

import FormBlog from './components/FormBlog/FormBlog'
import { PreviewBlog } from './components/PreviewBlog'
import { Tabs } from 'antd'
import { items } from './data'
import { setOpenDrawer } from '~/store/slices'
import { useAppSelector } from '~/store/hooks'

interface BlogFeatureProps {
  data: IBlogs[]
}

const BlogFeature = ({ data }: BlogFeatureProps) => {
  const dispatch = useAppDispatch()
  const { openDrawer } = useAppSelector((state) => state.drawer)
  const { user } = useAppSelector((state: RootState) => state.persistedReducer.auth)

  return (
    <div>
      <Breadcrumb pageName='Bài viết'>
        {user && user.role === IRoleUser.ADMIN && (
          <Button icon={<PlusIcon />} onClick={() => dispatch(setOpenDrawer(true))}>
            Thêm
          </Button>
        )}
      </Breadcrumb>

      <Tabs defaultActiveKey='1' items={items} />

      <FormBlog open={openDrawer} />
      <PreviewBlog />
    </div>
  )
}

export default BlogFeature
