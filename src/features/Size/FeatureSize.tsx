import { Breadcrumb, Button, PlusIcon } from '~/components'
import { setOpenDrawer, setSizes } from '~/store/slices'

import { IDocSize } from '~/types'
import { Tabs } from 'antd'
import { items } from './data'
import { useAppDispatch } from '~/store/store'
import { useEffect } from 'react'

export interface FeatureSizeProps {
  data: IDocSize
}

const FeatureSize = ({ data }: FeatureSizeProps) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(setSizes(data.docs))
  }, [dispatch, data])

  return (
    <div>
      <Breadcrumb pageName='Sizes'>
        <Button icon={<PlusIcon />} onClick={() => dispatch(setOpenDrawer(true))}>
          Thêm
        </Button>
      </Breadcrumb>

      {/* ==================== body table ==================== */}
      <Tabs defaultActiveKey='1' items={items} className='text-white' />
    </div>
  )
}

export default FeatureSize
