import { Breadcrumb, Button, PlusIcon } from '~/components'
import { setOpenDrawer, setToppingsList } from '~/store/slices'

import { ITopping } from '~/types'
import { Tabs } from 'antd'
import { ToppingAdd } from './components'
import { items } from './data'
import { useAppDispatch } from '~/store/store'
import { useAppSelector } from '~/store/hooks'
import { useEffect } from 'react'

interface ToppingFeatureProps {
  data: ITopping[]
}

const ToppingFeature = ({ data }: ToppingFeatureProps) => {
  const dispatch = useAppDispatch()
  const { openDrawer } = useAppSelector((state) => state.drawer)

  /* lưu data lên redux toolkit để quản lý */
  useEffect(() => {
    dispatch(setToppingsList(data))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, data, setToppingsList])

  return (
    <div>
      <Breadcrumb pageName='Toppings'>
        <Button icon={<PlusIcon />} onClick={() => dispatch(setOpenDrawer(true))}>
          Thêm
        </Button>
      </Breadcrumb>

      {/* ==================== body table ==================== */}
      <Tabs defaultActiveKey='1' items={items} className='text-white' />

      {/* ==================== Add Topping ==================== */}
      <ToppingAdd open={openDrawer} />
    </div>
  )
}

export default ToppingFeature
