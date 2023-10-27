import { Tabs } from 'antd'
import { Breadcrumb, Button, PlusIcon } from '~/components'
import { useAppSelector } from '~/store/hooks'
import { setOpenDrawer } from '~/store/slices'
import { useAppDispatch } from '~/store/store'
import { IBlogs } from '~/types'
import { items } from './data'
import FormBlog from './components/FormBlog/FormBlog'

interface BlogFeatureProps {
  data: IBlogs[]
}

const BlogFeature = ({ data }: BlogFeatureProps) => {
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
    </div>
  )
}

export default BlogFeature
