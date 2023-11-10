import { Breadcrumb, Button, PlusIcon } from '~/components'
import { useAppSelector } from '~/store/hooks'
import { setOpenDrawer } from '~/store/slices'
import { useAppDispatch } from '~/store/store'
import { items } from './data'
import { Tabs } from 'antd'
import FormCategoryBlog from './component/FormCategoryBlog/FormCategoryBlog'

const CategoriesBlog = () => {
  const dispatch = useAppDispatch()
  const { openDrawer } = useAppSelector((state) => state.drawer)
  return (
    <div>
      <Breadcrumb pageName='Danh mục blog'>
        <Button icon={<PlusIcon />} onClick={() => dispatch(setOpenDrawer(true))}>
          Thêm
        </Button>
      </Breadcrumb>
      <Tabs defaultActiveKey='1' items={items} className='text-white' />
      <FormCategoryBlog open={openDrawer} />
    </div>
  )
}

export default CategoriesBlog
