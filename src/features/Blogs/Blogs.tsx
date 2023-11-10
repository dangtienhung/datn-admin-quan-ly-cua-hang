import { Breadcrumb, Button, PlusIcon } from '~/components'

import FormBlog from './components/FormBlog/FormBlog'
import { IBlogs } from '~/types'
import { PreviewBlog } from './components/PreviewBlog'
import { Tabs } from 'antd'
import { items } from './data'
import { setOpenDrawer } from '~/store/slices'
import { useAppDispatch } from '~/store/store'
import { useAppSelector } from '~/store/hooks'

interface BlogFeatureProps {
  data: IBlogs[]
}

const BlogFeature = ({ data }: BlogFeatureProps) => {
  // console.log(data)
  const dispatch = useAppDispatch()
  const { openDrawer } = useAppSelector((state) => state.drawer)

  return (
    <div>
      <Breadcrumb pageName='Blogs'>
        <Button icon={<PlusIcon />} onClick={() => dispatch(setOpenDrawer(true))}>
          Thêm
        </Button>
      </Breadcrumb>

      <Tabs defaultActiveKey='1' items={items} />

      <FormBlog open={openDrawer} />
      <PreviewBlog />
    </div>
  )
}

export default BlogFeature
