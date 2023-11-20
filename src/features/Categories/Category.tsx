import { Breadcrumb, Button, PlusIcon } from '~/components'
import { RootState, useAppDispatch } from '~/store/store'

import FormCategory from './components/FormCategory/FormCategory'
import { IRoleUser } from '~/types'
import { Tabs } from 'antd'
import { items } from './data'
import { setOpenDrawer } from '~/store/slices'
import { useAppSelector } from '~/store/hooks'

const Category = () => {
  const dispatch = useAppDispatch()
  const { openDrawer } = useAppSelector((state) => state.drawer)
  const { user } = useAppSelector((state: RootState) => state.persistedReducer.auth)

  return (
    <div>
      <Breadcrumb pageName='Danh mục'>
        {user && user.role === IRoleUser.ADMIN && (
          <Button icon={<PlusIcon />} onClick={() => dispatch(setOpenDrawer(true))}>
            Thêm
          </Button>
        )}
      </Breadcrumb>
      <Tabs defaultActiveKey='1' items={items} className='text-white' />
      <FormCategory open={openDrawer} />
    </div>
  )
}

export default Category
