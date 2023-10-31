import { Breadcrumb, Button, PlusIcon } from '~/components'
import { FormProduct, PreviewProduct } from './components'
import { RootState, useAppDispatch } from '~/store/store'
import { memo, useEffect, useState } from 'react'

import { IProduct } from '~/types'
import { Tabs } from 'antd'
import { handleTogglePreviewProduct } from './utils'
import { items } from './data/data'
import { setOpenDrawer } from '~/store/slices'
import { setProductsList } from '~/store/slices/Products/product.slice'
import { useAppSelector } from '~/store/hooks'

interface FeatureProductsProps {
  data: IProduct[]
}

const FeatureProducts = ({ data }: FeatureProductsProps) => {
  const dispatch = useAppDispatch()
  const { openDrawer } = useAppSelector((state: RootState) => state.drawer)
  const [openPreProduct, setOpenPreProduct] = useState<boolean>(false)

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

      <FormProduct open={openDrawer} />

      {/* preview product */}
      <PreviewProduct
        open={openPreProduct}
        onClose={() => handleTogglePreviewProduct(openPreProduct, setOpenPreProduct)}
      />
    </div>
  )
}

export default FeatureProducts
