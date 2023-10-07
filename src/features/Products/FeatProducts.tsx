import { Breadcrumb, Button, PlusIcon } from '~/components'

import { IProduct } from '~/types'
import { Tabs } from 'antd'
import { items } from './data/data'
import { setOpenDrawer } from '~/store/slices'
import { setProductsList } from '~/store/slices/Products/product.slice'
import { useAppDispatch } from '~/store/store'
import { useEffect } from 'react'

interface FeatureProductsProps {
  data: IProduct[]
}

const FeatureProducts = ({ data }: FeatureProductsProps) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(setProductsList(data))
  }, [dispatch, data])

  return (
    <div>
      <Breadcrumb pageName='Toppings'>
        <Button icon={<PlusIcon />} onClick={() => dispatch(setOpenDrawer(true))}>
          Thêm
        </Button>
      </Breadcrumb>
      <Tabs defaultActiveKey='1' items={items} />
    </div>
  )
}

export default FeatureProducts
