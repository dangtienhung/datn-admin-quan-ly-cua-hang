import { BsFillPencilFill, BsFillTrashFill } from 'react-icons/bs'
import { Popconfirm, Space, Table, message } from 'antd'
import { setCategory, setOpenDrawer } from '~/store/slices'
import { useDeleteCategoryMutation, useGetAllCategoryQuery } from '~/store/services'

import { Button } from '~/components'
import { ColumnsType } from 'antd/es/table'
import { ICategory } from '~/types'
import Loading from '~/components/Loading/Loading'
import { NotFound } from '~/pages'
import { cancelDelete } from '../..'
import { useAppDispatch } from '~/store/store'
import { useState } from 'react'

const ListCategory = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const { data: categories, isError, isLoading } = useGetAllCategoryQuery(currentPage)
  const [deleteCategory] = useDeleteCategoryMutation()
  const dispatch = useAppDispatch()

  const handleDelete = (id: string) => {
    deleteCategory(id)
      .unwrap()
      .then(() => message.success('Xóa thành công'))
      .catch(() => cancelDelete())
  }

  if (isLoading) return <Loading />
  if (isError) return <NotFound />
  const columns: ColumnsType<ICategory> = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      width: 50
    },
    {
      title: 'Tên danh mục',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => <span className='capitalize'>{name}</span>
    },

    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      width: 300,
      render: (_, category) => (
        <Space size='middle'>
          <Button
            icon={<BsFillPencilFill />}
            onClick={() => {
              dispatch(setCategory({ _id: category._id, name: category.name }))
              dispatch(setOpenDrawer(true))
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title='Bạn có muốn xóa danh mục này?'
            description='Are you sure to delete this task?'
            okButtonProps={{ style: { backgroundColor: '#3C50E0', color: '#fff' } }}
            onCancel={cancelDelete}
            onConfirm={() => handleDelete(category._id)}
            okText='Có'
            cancelText='Không'
          >
            <Button variant='danger' icon={<BsFillTrashFill />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  const categorriesData = categories?.docs.map((item: ICategory, index) => ({
    ...item,
    key: item._id,
    index: index + 1
  }))
  return (
    <div className='dark:bg-graydark'>
      <Table
        columns={columns}
        dataSource={categorriesData}
        pagination={{
          pageSize: categories && categories.limit,
          // showSizeChanger: true,
          // pageSizeOptions: ['5', '10', '15', '20'],
          total: categories && categories?.totalDocs,
          onChange(page) {
            setCurrentPage(page)
          }
        }}
        scroll={{ y: '50vh' }}
        bordered
      />
    </div>
  )
}

export default ListCategory
