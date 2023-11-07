import { Tabs } from 'antd'
import { Breadcrumb, Button, PlusIcon } from '~/components'
import { items } from './data'
import { useAppDispatch } from '~/store/store'
import { useAppSelector } from '~/store/hooks'
import { setOpenDrawer } from '~/store/slices'
import { FormCustomer } from './components/FormCustomer'

const CustomerFeature = () => {
  const dispatch = useAppDispatch()
  const { openDrawer } = useAppSelector((state) => state.drawer)

  return (
    <div>
      <Breadcrumb pageName='Khách hàng'>
        <Button icon={<PlusIcon />} onClick={() => dispatch(setOpenDrawer(true))}>
          Thêm
        </Button>
      </Breadcrumb>

      <Tabs defaultActiveKey='1' items={items} className='text-white' />
      <FormCustomer open={openDrawer} />
    </div>
  )
}

export default CustomerFeature
