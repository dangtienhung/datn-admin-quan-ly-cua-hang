import { useEffect } from 'react'
import { Breadcrumb, Button, PlusIcon } from '~/components'
import { useAppDispatch } from '~/store/store'
import { FormProduct, PreviewProduct } from './components'

import { Tabs } from 'antd'
import { setOpenDrawer } from '~/store/slices'
import { setProductsList } from '~/store/slices/Products/product.slice'
import { IProduct } from '~/types'
import { items } from './data/data'

interface FeatureProductsProps {
  data: IProduct[]
}

const FeatureProducts = ({ data }: FeatureProductsProps) => {
  const dispatch = useAppDispatch()
  // const { openDrawer } = useAppSelector((state: RootState) => state.drawer)
  // const [openPreProduct, setOpenPreProduct] = useState<boolean>(false)

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

      <FormProduct />

      {/* preview product */}
      <PreviewProduct />
    </div>
  )
}

export default FeatureProducts
