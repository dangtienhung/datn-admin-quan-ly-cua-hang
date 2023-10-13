import { Popconfirm, Space, Table, Image } from 'antd'
import Loading from '~/components/Loading/Loading'
import { NotFound } from '~/pages'
import { useGetAllUserByRoleQuery } from '~/store/services/Users'
import { Button } from '~/components'
import { IUser } from '~/types'
import { cancelDelete } from '~/features/Toppings'
import { useState } from 'react'
import { BsFillPencilFill, BsFillTrashFill } from 'react-icons/bs'
import { useAppDispatch } from '~/store/store'
import { setUser } from '~/store/slices/User/user.slice'
import { setOpenDrawer } from '~/store/slices'
import { ColumnsType } from 'antd/es/table'

// type Props = {}

export const ListCustomers = () => {
  const dispatch = useAppDispatch()
  const [options, setoptions] = useState({
    page: 1,
    limit: 10,
    roleName: 'customer' as 'customer' | 'staff'
  })
  const { data: customersData, isLoading, isError } = useGetAllUserByRoleQuery(options)

  const columns: ColumnsType<any> = [
    {
      title: '#',
      dataIndex: 'index',
      width: 50,
      defaultSortOrder: 'ascend',
      sorter: (a, b) => a.index - b.index
    },
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (avatar: string) => <Image className='!w-[100px] !h-[100px]' src={avatar} />
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      render: (name: string) => <span className='capitalize'>{name}</span>
    },
    {
      title: 'Tài khoản',
      dataIndex: 'account',
      key: 'account',
      render: (account: string) => <span>{account}</span>
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
      width: 80,
      render: (gender: string) => <span>{gender === 'male' ? 'Nam' : gender === 'female' ? 'Nữ' : 'Khác'}</span>
    },
    {
      title: 'Chức vụ',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => <span className='capitalize'>{role && 'Khách hàng'}</span>
    },
    {
      title: 'Action',
      key: 'action',
      width: 300,
      render: (_: any, customer: IUser) => (
        <Space size='middle'>
          <Button
            icon={<BsFillPencilFill />}
            onClick={() => {
              dispatch(setUser({ ...customer }))
              dispatch(setOpenDrawer(true))
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title='Bạn có muốn xóa khách hàng này?'
            okButtonProps={{ style: { backgroundColor: '#3C50E0', color: '#fff' } }}
            okText='Có'
            cancelText='Không'
            onCancel={cancelDelete}
            // onConfirm={() => handleDelete(size._id)}
          >
            <Button variant='danger' icon={<BsFillTrashFill />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  const customers = customersData?.data?.docs.map((customer: any, index: number) => ({
    ...customer,
    key: customer._id,
    index: index + 1
  }))
  console.log(customers)

  if (isLoading) return <Loading />
  if (isError) return <NotFound />
  return (
    <div className='dark:bg-graydark'>
      <Table
        columns={columns}
        dataSource={customers}
        bordered
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: ['10', '15', '20', '25'],
          total: customersData?.data?.totalDocs,
          onChange(page, pageSize) {
            setoptions((prev) => ({ ...prev, page, limit: pageSize }))
          }
        }}
        scroll={{ y: '50vh' }}
      />
    </div>
  )
}
