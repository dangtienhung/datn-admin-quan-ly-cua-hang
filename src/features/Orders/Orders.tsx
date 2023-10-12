import { Breadcrumb } from '~/components'
import { DatePicker } from 'antd'

import { Tabs } from 'antd'
import { items } from './data'
import { useAppSelector } from '~/store/hooks'
import DetailOrder from './components/DetailOrder/DetailOrder'
import ModalCancelReason from './components/ModalCancelReason/ModalCancelReason'

const Orders = () => {
  const { openDrawer } = useAppSelector((state) => state.drawer)
  return (
    <div>
      <Breadcrumb pageName='Orders'>
        <DatePicker size='large' />
      </Breadcrumb>
      <Tabs defaultActiveKey='1' items={items} className='text-white' />
      <DetailOrder open={openDrawer} />
      <ModalCancelReason />
    </div>
  )
}

export default Orders
