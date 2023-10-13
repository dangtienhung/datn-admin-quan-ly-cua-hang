import Loading from '~/components/Loading/Loading'
import { BsFillTrashFill } from 'react-icons/bs'
import { RedoOutlined } from '@ant-design/icons'
import { Popconfirm, Space, Table } from 'antd'
import { Button } from '~/components'
import { ColumnsType } from 'antd/es/table'
import { ICategory } from '~/types'
import { NotFound } from '~/pages'
import { useDeleteRealMutation, useGetAllCategoryDeletedQuery, useRestoreCategoryMutation } from '~/store/services'
import { useState } from 'react'
import { pause } from '~/utils/pause'
import { messageAlert } from '~/utils/messageAlert'

const ListCategoryDeleted = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const { data: categories, isError, isLoading } = useGetAllCategoryDeletedQuery(currentPage)
  const [deleteRealCategory] = useDeleteRealMutation()
  const [restoreCategory] = useRestoreCategoryMutation()

  const handleRestore = async (id: string) => {
    await pause(2000)
    restoreCategory(id)
      .unwrap()
      .then(() => messageAlert('Khôi phục thành công', 'success'))
      .catch(() => messageAlert('Khôi phục thất bại', 'error'))
  }

  const handleDeleteReal = async (id: string) => {
    await pause(2000)
    deleteRealCategory(id)
      .unwrap()
      .then(() => messageAlert('Xóa thành công', 'success'))
      .catch(() => messageAlert('Xóa thất bại', 'error'))
  }
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
          <Popconfirm
            title='Bạn muốn khôi phục lại danh mục này?'
            description='Bạn thực sự muốn khôi phục lại danh mục này?'
            onConfirm={() => handleRestore(category._id)}
          >
            <Button icon={<RedoOutlined className='text-lg' />}>Khôi phục</Button>
          </Popconfirm>
          <Popconfirm
            title='Bạn có muốn xóa VĨNH VIỄN danh mục này?'
            description='Hành động này sẽ không thể khôi phục lại!'
            okButtonProps={{ style: { backgroundColor: '#3C50E0', color: '#fff' } }}
            // onCancel={cancelDelete}
            onConfirm={() => handleDeleteReal(category._id)}
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

  if (isLoading) return <Loading />
  if (isError) return <NotFound />
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

export default ListCategoryDeleted
