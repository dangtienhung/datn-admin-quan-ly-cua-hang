import Loading from '~/components/Loading/Loading'
import { BsFillPencilFill, BsFillTrashFill } from 'react-icons/bs'
import { Popconfirm, Space, Table } from 'antd'
import { useAppDispatch } from '~/store/store'
import { setCategory, setOpenDrawer } from '~/store/slices'
import { Button } from '~/components'
import { ColumnsType } from 'antd/es/table'
import { ICategory } from '~/types'
import { cancelDelete } from '../..'
import { NotFound } from '~/pages'
import { useDeleteFakeMutation, useGetAllCategoryQuery } from '~/store/services'
import { useState } from 'react'
import { pause } from '~/utils/pause'
import { messageAlert } from '~/utils/messageAlert'

const ListCategory = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const { data: categories, isError, isLoading } = useGetAllCategoryQuery(currentPage)
  const [deleteFakeCategory] = useDeleteFakeMutation()
  const dispatch = useAppDispatch()

  const handleDelete = async (id: string) => {
    await pause(2000)
    deleteFakeCategory(id)
      .unwrap()
      .then(() => messageAlert('Xóa thành công', 'success'))
      .catch(() => cancelDelete())
  }

  if (isLoading) return <Loading />
  if (isError) return <NotFound />
  const columns: ColumnsType<ICategory> = [
    {
      title: '#',
      dataIndex: 'index'
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
            description='Bạn chắc chắn muốn xóa danh mục này?'
            okButtonProps={{ style: { backgroundColor: '#3C50E0', color: '#fff' } }}
            onCancel={cancelDelete}
            onConfirm={() => handleDelete(category._id)}
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
