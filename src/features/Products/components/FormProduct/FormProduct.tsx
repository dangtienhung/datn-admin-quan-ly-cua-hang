import { setOpenDrawer, setProductId } from '~/store/slices'

import { Drawer } from 'antd'
import { memo } from 'react'
import { useAppDispatch } from '~/store/store'
import { useAppSelector } from '~/store/hooks'

interface FormProductProps {
  open: boolean
}

const FormProduct = ({ open }: FormProductProps) => {
  const dispatch = useAppDispatch()
  const { productId } = useAppSelector((state) => state.products)

  return (
    <Drawer
      title={`${productId === null ? 'Thêm' : 'Cập nhật'} sản phẩm`}
      placement='right'
      width={800}
      onClose={() => {
        dispatch(setOpenDrawer(false))
        dispatch(setProductId(null))
      }}
      open={open}
    >
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </Drawer>
  )
}

export default FormProduct
