import { SettingOutlined, UserOutlined, BarChartOutlined, ShoppingOutlined } from '@ant-design/icons'
import { AiOutlineFontSize, AiOutlineControl } from 'react-icons/ai'
import { IoTicket } from 'react-icons/io5'
import { BiSolidCategoryAlt } from 'react-icons/bi'
import { HiCollection } from 'react-icons/hi'
import { FaUserEdit, FaUserFriends, FaClipboardList } from 'react-icons/fa'
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
  getItem(<NavLink to={`/dashboard`}>Thống kê</NavLink>, 'dashboard', <BarChartOutlined />),

  // quản lý đơn hàng
  getItem(<NavLink to={`/manager/orders`}>Đơn hàng</NavLink>, 'orders', <FaClipboardList />),

  // quản lý sản phẩm
  getItem('Quản lý', 'manager', <AiOutlineControl className='!text-base' />, [
    getItem(<NavLink to={`/manager/products`}>Sản phẩm</NavLink>, 'product', <ShoppingOutlined />),
    getItem(<NavLink to={`/manager/categories`}>Danh mục</NavLink>, 'categories', <BiSolidCategoryAlt />),
    getItem(<NavLink to={`/manager/toppings`}>Topping</NavLink>, 'Topping', <HiCollection />),
    getItem(<NavLink to={`/manager/sizes`}>Sizes</NavLink>, 'Sizes', <AiOutlineFontSize />),
    getItem(<NavLink to={`/manager/vouchers`}>Vouchers</NavLink>, 'Vouchers', <IoTicket />)
  ]),

  // quản lý người dùng
  getItem('Người dùng', 'users', <UserOutlined />, [
    getItem(<NavLink to={`/manager/customers`}>Khách hàng</NavLink>, 'customers', <FaUserFriends />),
    getItem(<NavLink to={`/manager/staffs`}>Nhân viên</NavLink>, 'staffs', <FaUserEdit />)
  ]),

  getItem(<NavLink to={`/settings`}>Cài đặt</NavLink>, 'settings', <SettingOutlined />)
]
