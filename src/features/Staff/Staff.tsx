import { Tabs } from 'antd'
import { Breadcrumb, Button, PlusIcon } from '~/components'
import { useAppDispatch } from '~/store/store'
import { useAppSelector } from '~/store/hooks'
import { setOpenDrawer } from '~/store/slices'
import { items } from './data'
import { FormStaff } from './components'

const StaffFeature = () => {
  const dispatch = useAppDispatch()
  const { openDrawer } = useAppSelector((state) => state.drawer)
  return (
    <div>
      <Breadcrumb pageName='Customers'>
        <Button icon={<PlusIcon />} onClick={() => dispatch(setOpenDrawer(true))}>
          Thêm
        </Button>
      </Breadcrumb>

      <Tabs defaultActiveKey='1' items={items} className='text-white' />
      <FormStaff open={openDrawer} />
    </div>
  )
}
export default StaffFeature
