import { Breadcrumb, Button, PlusIcon } from '~/components'
import { RootState, useAppDispatch } from '~/store/store'

import { FormSliders } from './components'
import { IRoleUser } from '~/types'
import { Tabs } from 'antd'
import { items } from './data'
import { setOpenDrawer } from '~/store/slices'
import { useAppSelector } from '~/store/hooks'

const SlidersFeature = () => {
  const dispatch = useAppDispatch()
  const { openDrawer } = useAppSelector((state) => state.drawer)

  const { user } = useAppSelector((state: RootState) => state.persistedReducer.auth)
  return (
    <div>
      <Breadcrumb pageName='Sliders'>
        {user && user.role === IRoleUser.ADMIN && (
          <Button icon={<PlusIcon />} onClick={() => dispatch(setOpenDrawer(true))}>
            Thêm
          </Button>
        )}
      </Breadcrumb>

      {/* ==================== body table ==================== */}
      <Tabs defaultActiveKey='1' items={items} className='text-white' />
      <FormSliders open={openDrawer} />
    </div>
  )
}

export default SlidersFeature
