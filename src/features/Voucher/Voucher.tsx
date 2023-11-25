import { Breadcrumb, Button, PlusIcon } from '~/components'
import { IRoleUser, IVoucher } from '~/types'
import { RootState, useAppDispatch } from '~/store/store'

import { Tabs } from 'antd'
import VoucherAdd from './component/FormVoucher/FormVoucher'
import { items } from './data'
import { setOpenDrawer } from '~/store/slices'
import { useAppSelector } from '~/store/hooks'

interface VoucherFeatureProps {
  data: IVoucher[]
}
const VoucherFeature = ({ data }: VoucherFeatureProps) => {
  const dispatch = useAppDispatch()
  const { openDrawer } = useAppSelector((state) => state.drawer)

  const { user } = useAppSelector((state: RootState) => state.persistedReducer.auth)

  return (
    <div>
      <Breadcrumb pageName='Vouchers'>
        {user && user.role === IRoleUser.ADMIN && (
          <Button icon={<PlusIcon />} onClick={() => dispatch(setOpenDrawer(true))}>
            Thêm
          </Button>
        )}
      </Breadcrumb>

      <Tabs defaultActiveKey='1' items={items}></Tabs>
      <VoucherAdd open={openDrawer} />
    </div>
  )
}

export default VoucherFeature
