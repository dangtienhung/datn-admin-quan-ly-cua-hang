import { Image, Popconfirm, Space, Table } from 'antd'
import Loading from '~/components/Loading/Loading'
import { NotFound } from '~/pages'
import { useDeleteUserMutation, useGetAllUserByRoleQuery } from '~/store/services/Users'
import { Button } from '~/components'
import { cancelDelete } from '~/features/Toppings'
import { useState } from 'react'

import { BsFillPencilFill, BsFillTrashFill } from 'react-icons/bs'
import { useAppDispatch } from '~/store/store'
import { setOpenDrawer } from '~/store/slices'
import { setUser } from '~/store/slices/User/user.slice'
import { IUser } from '~/types'
import { ColumnsType } from 'antd/es/table'
import { messageAlert } from '~/utils/messageAlert'

export const ListStaffs = () => {
  const dispatch = useAppDispatch()
  const [deleteUser] = useDeleteUserMutation()
  const [options, setoptions] = useState({
    page: 1,
    limit: 10,
    roleName: 'staff' as 'customer' | 'staff'
  })
  const { data: staffData, isLoading, isError } = useGetAllUserByRoleQuery(options)

  const handleDelete = async (id: string) => {
    await deleteUser(id)
      .unwrap()
      .then(() => {
        messageAlert('Xóa thành công', 'success')
      })
      .catch(() => messageAlert('Xóa thất bại!', 'error'))
  }
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
      title: 'Action',
      key: 'action',
      width: 300,
      render: (_: any, staff: IUser) => (
        <Space size='middle'>
          <Button
            icon={<BsFillPencilFill />}
            onClick={() => {
              dispatch(setOpenDrawer(true))
              dispatch(setUser({ ...staff }))
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title='Bạn có muốn xóa nhân viên này?'
            okButtonProps={{ style: { backgroundColor: '#3C50E0', color: '#fff' } }}
            onCancel={cancelDelete}
            onConfirm={() => handleDelete(staff._id!)}
          >
            <Button variant='danger' icon={<BsFillTrashFill />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]
  const staffs = staffData?.data?.docs?.map((staff: any, index: number) => ({
    ...staff,
    key: staff._id,
    index: index + 1
  }))
  if (isLoading) return <Loading />
  if (isError) return <NotFound />
  return (
    <div className='dark:bg-graydark'>
      <Table
        columns={columns}
        dataSource={staffs}
        bordered
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: ['10', '15', '20', '25'],
          total: staffData?.data?.totalDocs,
          onChange(page, pageSize) {
            setoptions((prev) => ({ ...prev, page, limit: pageSize }))
          }
        }}
        scroll={{ y: '50vh' }}
      />
    </div>
  )
}
