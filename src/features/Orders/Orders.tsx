import { Breadcrumb } from '~/components'
import { setOpenDrawer } from '~/store/slices'
import { DatePicker } from 'antd'

import { Tabs } from 'antd'
import { items } from './data'
import { useAppSelector } from '~/store/hooks'
import DetailOrder from './components/DetailOrder/DetailOrder'

const Orders = () => {
  const { openDrawer } = useAppSelector((state) => state.drawer)
  return (
    <div>
      <Breadcrumb pageName='Orders'>
        <DatePicker size='large' />
      </Breadcrumb>
      <Tabs defaultActiveKey='1' items={items} className='text-white' />
      <DetailOrder open={openDrawer} />
    </div>
  )
}

export default Orders
