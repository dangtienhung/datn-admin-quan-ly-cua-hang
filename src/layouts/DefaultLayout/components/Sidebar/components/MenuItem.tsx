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
  // getItem('Navigation One', 'sub1', <MailOutlined />, [
  //   getItem('Item 1', 'g1', null, [getItem('Option 1', '1'), getItem('Option 2', '2')], 'group'),
  //   getItem('Item 2', 'g2', null, [getItem('Option 3', '3'), getItem('Option 4', '4')], 'group')
  // ]),

  getItem(<NavLink to={`/`}>Dasbboard</NavLink>, 'dashboard', <AppstoreOutlined />),

  getItem('Sản phẩm', 'products', <AppstoreOutlined />, [
    getItem(<NavLink to={`/manager/products`}>Sản phẩm</NavLink>, 'product'),
    getItem(<NavLink to={`/manager/toppings`}>Topping</NavLink>, 'Topping'),
    getItem('Size', 'size')
    // getItem('Submenu', 'sub3', null, [getItem('Option 7', '7'), getItem('Option 8', '8')])
  ]),

  getItem('Người dùng', 'users', <AppstoreOutlined />, [
    getItem(<NavLink to={`/manager/users`}>Khách hàng</NavLink>, 'customers'),
    getItem('Nhân viên', 'staffs')
    // getItem('Submenu', 'sub3', null, [getItem('Option 7', '7'), getItem('Option 8', '8')])
  ]),

  getItem(<NavLink to={`/settings`}>Cài đặt</NavLink>, 'settings', <SettingOutlined />)

  // getItem('Group', 'grp', null, [getItem('Option 13', '13'), getItem('Option 14', '14')], 'group')
]
