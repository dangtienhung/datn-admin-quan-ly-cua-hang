import { Breadcrumb, Button, PlusIcon } from '~/components'
import { RootState, useAppDispatch } from '~/store/store'

import FormCategoryBlog from './component/FormCategoryBlog/FormCategoryBlog'
import { IRoleUser } from '~/types'
import { Tabs } from 'antd'
import { items } from './data'
import { setOpenDrawer } from '~/store/slices'
import { useAppSelector } from '~/store/hooks'

const CategoriesBlog = () => {
  const dispatch = useAppDispatch()
  const { openDrawer } = useAppSelector((state: RootState) => state.drawer)

  const { user } = useAppSelector((state: RootState) => state.persistedReducer.auth)
  return (
    <div>
      <Breadcrumb pageName='Danh mục blog'>
        {user.role === IRoleUser.ADMIN && (
          <Button icon={<PlusIcon />} onClick={() => dispatch(setOpenDrawer(true))}>
            Thêm
          </Button>
        )}
      </Breadcrumb>
      <Tabs defaultActiveKey='1' items={items} className='text-white' />
      <FormCategoryBlog open={openDrawer} />
    </div>
  )
}

export default CategoriesBlog
