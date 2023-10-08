import { BsFillPencilFill, BsFillTrashFill } from 'react-icons/bs'
import { Popconfirm, Space, Table, message } from 'antd'
import { useAppDispatch } from '~/store/store'

import { Button } from '~/components'
import { ISize } from '~/types'
import { formatCurrency } from '~/utils'
import { setOpenDrawer, setSize } from '~/store/slices'
import { useDeleteSizeMutation, useGetAllSizesQuery } from '~/store/services'
import { cancelDelete } from '~/features/Toppings'
import { useState } from 'react'
import Loading from '~/components/Loading/Loading'
import { NotFound } from '~/pages'

export const ListSizes = () => {
  const dispatch = useAppDispatch()
  const [currentPage, setCurrentPage] = useState(1)
  const { data: sizeList, isLoading, isError } = useGetAllSizesQuery(currentPage)

  const [deleteSize] = useDeleteSizeMutation()
  const handleDelete = (id: string) => {
    deleteSize(id)
      .unwrap()
      .then(() => message.success('Xóa thành công'))
      .catch(() => message.error('Xóa thất bại'))
  }
  if (isLoading) return <Loading />
  if (isError) return <NotFound />
  const columns = [
    {
      title: '#',
      dataIndex: 'index'
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => <span className='uppercase'>{name}</span>
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `${formatCurrency(price)}`
    },
    {
      title: 'Action',
      key: 'action',
      width: 300,
      render: (_: any, size: ISize) => (
        <Space size='middle'>
          <Button
            icon={<BsFillPencilFill />}
            onClick={() => {
              dispatch(setSize(size))
              dispatch(setOpenDrawer(true))
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title='Bạn có muốn xóa topping này?'
            description='Are you sure to delete this task?'
            okButtonProps={{ style: { backgroundColor: '#3C50E0', color: '#fff' } }}
            okText='Có'
            cancelText='Không'
            onCancel={cancelDelete}
            onConfirm={() => handleDelete(size._id)}
          >
            <Button variant='danger' icon={<BsFillTrashFill />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  const sizes = sizeList?.docs.map((size, index) => ({ ...size, key: size._id, index: index + 1 }))

  return (
    <div className='dark:bg-graydark'>
      <Table
        columns={columns}
        dataSource={sizes}
        pagination={{
          pageSize: 10,
          total: sizeList?.totalDocs,
          onChange(page) {
            setCurrentPage(page)
          }
        }}
      />
    </div>
  )
}