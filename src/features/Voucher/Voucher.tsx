import { Tabs } from 'antd'
import { Breadcrumb, Button, PlusIcon } from '~/components'
import { useAppSelector } from '~/store/hooks'
import { setOpenDrawer } from '~/store/slices'
import { useAppDispatch } from '~/store/store'
import { IVoucher } from '~/types'
import { items } from './data'
import VoucherAdd from './component/FormVoucher/FormVoucher'

interface VoucherFeatureProps {
  data: IVoucher[]
}
const VoucherFeature = ({ data }: VoucherFeatureProps) => {
  console.log(data)
  const dispatch = useAppDispatch()
  const { openDrawer } = useAppSelector((state) => state.drawer)

  return (
    <div>
      <Breadcrumb pageName='Vouchers'>
        <Button icon={<PlusIcon />} onClick={() => dispatch(setOpenDrawer(true))}>
          Thêm
        </Button>
      </Breadcrumb>

      <Tabs defaultActiveKey='1' items={items}></Tabs>
      <VoucherAdd open={openDrawer} />
    </div>
  )
}

export default VoucherFeature
