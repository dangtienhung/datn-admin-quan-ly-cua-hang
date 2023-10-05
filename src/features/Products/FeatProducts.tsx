import { Breadcrumb, Button, PlusIcon } from '~/components'
import { RootState, useAppDispatch } from '~/store/store'

import { setOpenDrawer } from '~/store/slices'

const FeatureProducts = () => {
  const dispatch = useAppDispatch()

  return (
    <div>
      <Breadcrumb pageName='Toppings'>
        <Button icon={<PlusIcon />} onClick={() => dispatch(setOpenDrawer(true))}>
          Thêm
        </Button>
      </Breadcrumb>
    </div>
  )
}

export default FeatureProducts
