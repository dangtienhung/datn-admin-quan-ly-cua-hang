import { Breadcrumb, Button, PlusIcon } from '~/components'
import { setOpenDrawer } from '~/store/slices'

import { Tabs } from 'antd'
import { items } from './data'
import { useAppDispatch } from '~/store/store'
import { useAppSelector } from '~/store/hooks'
import FormCategory from './components/FormCategory/FormCategory'

const Category = () => {
  const dispatch = useAppDispatch()
  const { openDrawer } = useAppSelector((state) => state.drawer)
  // console.log(data)

  return (
    <div>
      <Breadcrumb pageName='Categories'>
        <Button icon={<PlusIcon />} onClick={() => dispatch(setOpenDrawer(true))}>
          Thêm
        </Button>
      </Breadcrumb>
      <Tabs defaultActiveKey='1' items={items} className='text-white' />
      <FormCategory open={openDrawer} />
    </div>
  )
}

export default Category
