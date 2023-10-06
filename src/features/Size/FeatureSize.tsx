import { Breadcrumb, Button, PlusIcon } from '~/components'
import { setOpenDrawer } from '~/store/slices'

import { Tabs } from 'antd'
import { items } from './data'
import { useAppDispatch } from '~/store/store'
import { FormSIze } from './components'
import { useAppSelector } from '~/store/hooks'

const FeatureSize = () => {
  const dispatch = useAppDispatch()
  const { openDrawer } = useAppSelector((state) => state.drawer)

  return (
    <div>
      <Breadcrumb pageName='Sizes'>
        <Button icon={<PlusIcon />} onClick={() => dispatch(setOpenDrawer(true))}>
          Thêm
        </Button>
      </Breadcrumb>

      {/* ==================== body table ==================== */}
      <Tabs defaultActiveKey='1' items={items} className='text-white' />
      <FormSIze open={openDrawer} />
    </div>
  )
}

export default FeatureSize
