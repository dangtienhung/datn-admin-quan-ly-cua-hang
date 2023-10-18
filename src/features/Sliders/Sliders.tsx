import { Breadcrumb, Button, PlusIcon } from '~/components'
import { setOpenDrawer } from '~/store/slices'

import { Tabs } from 'antd'
import { items } from './data'
import { useAppDispatch } from '~/store/store'
import { useAppSelector } from '~/store/hooks'
import { FormSliders } from './components'

const SlidersFeature = () => {
  const dispatch = useAppDispatch()
  const { openDrawer } = useAppSelector((state) => state.drawer)
  return (
    <div>
      <Breadcrumb pageName='Sliders'>
        <Button icon={<PlusIcon />} onClick={() => dispatch(setOpenDrawer(true))}>
          Thêm
        </Button>
      </Breadcrumb>

      {/* ==================== body table ==================== */}
      <Tabs defaultActiveKey='1' items={items} className='text-white' />
      <FormSliders open={openDrawer} />
    </div>
  )
}

export default SlidersFeature
