import { Breadcrumb } from '~/components'
import { DatePicker } from 'antd'

import { Tabs } from 'antd'
import { items } from './data'
import { useAppSelector } from '~/store/hooks'
import DetailOrder from './components/DetailOrder/DetailOrder'
import ModalCancelReason from './components/ModalCancelReason/ModalCancelReason'
import type { DatePickerProps } from 'antd'
import { useAppDispatch } from '~/store/store'
import { setOrderDate } from '~/store/slices/Orders'

const Orders = () => {
  const { openDrawer } = useAppSelector((state) => state.drawer)
  const dispatch = useAppDispatch()
  const onDateChange: DatePickerProps['onChange'] = (_, dateString) => {
    dispatch(setOrderDate(dateString))
  }
  return (
    <div>
      <Breadcrumb pageName='Orders'>
        <DatePicker size='large' onChange={onDateChange} />
      </Breadcrumb>
      <Tabs defaultActiveKey='1' items={items} className='text-white' />
      <DetailOrder open={openDrawer} />
      <ModalCancelReason />
    </div>
  )
}

export default Orders
