import { AppstoreOutlined, SettingOutlined } from '@ant-design/icons'

import type { MenuProps } from 'antd'
import { NavLink } from 'react-router-dom'

type MenuItem = Required<MenuProps>['items'][number]

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type
  } as MenuItem
}

export const items: MenuProps['items'] = [
  // giao diên chính
  getItem(<NavLink to={`/dashboard`}>Dasbboard</NavLink>, 'dashboard', <AppstoreOutlined />),

  // quản lý đơn hàng
  getItem(<NavLink to={`/manager/orders`}>Đơn hàng</NavLink>, 'orders', <AppstoreOutlined />),

  // quản lý sản phẩm
  getItem('Sản phẩm', 'products', <AppstoreOutlined />, [
    getItem(<NavLink to={`/manager/products`}>Sản phẩm</NavLink>, 'product'),
    getItem(<NavLink to={`/manager/toppings`}>Topping</NavLink>, 'Topping'),
    getItem('Size', 'size')
    // getItem('Submenu', 'sub3', null, [getItem('Option 7', '7'), getItem('Option 8', '8')])
  ]),

  // quản lý người dùng
  getItem('Người dùng', 'users', <AppstoreOutlined />, [
    getItem('Khách hàng', 'customers'),
    getItem('Nhân viên', 'staffs')
  ]),

  getItem(<NavLink to={`/settings`}>Cài đặt</NavLink>, 'settings', <SettingOutlined />)
]
