import { ProductList } from '../components'
import type { TabsProps } from 'antd'
import { v4 as uuidv4 } from 'uuid'

export const items: TabsProps['items'] = [
  {
    key: uuidv4(),
    label: 'Tất cả sản phẩm',
    children: <ProductList />
  },
  {
    key: uuidv4(),
    label: 'Các sản phẩm đang hoạt động',
    children: 'Content of Tab Pane 3'
  },
  {
    key: uuidv4(),
    label: 'Các sản phẩm đã ẩn',
    children: 'Content of Tab Pane 4'
  },
  {
    key: uuidv4(),
    label: 'Các sản phẩm đã xóa',
    children: 'Content of Tab Pane 2'
  }
]
