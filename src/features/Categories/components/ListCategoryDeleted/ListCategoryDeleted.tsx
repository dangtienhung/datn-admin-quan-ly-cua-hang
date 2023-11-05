import Loading from '~/components/Loading/Loading'
import { BsFillTrashFill } from 'react-icons/bs'
import { RedoOutlined } from '@ant-design/icons'
import { Popconfirm, Space, Table, Button as ButtonAnt, Tooltip } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { ICategory } from '~/types'
import { NotFound } from '~/pages'
import { useDeleteRealMutation, useGetAllCategoryDeletedQuery, useRestoreCategoryMutation } from '~/store/services'
import { useState } from 'react'
import { pause } from '~/utils/pause'
import { messageAlert } from '~/utils/messageAlert'
import { cancelDelete } from '../..'

const ListCategoryDeleted = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
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
  const handleDeleteMany = () => {
    selectedRowKeys.forEach((selectedItem) => {
      deleteRealCategory(selectedItem as string)
        .unwrap()
        .then(() => {
          messageAlert('Xóa thành công', 'success')
        })
        .catch(() => cancelDelete())
    })
    setSelectedRowKeys([])
  }

  const handleRestoreMany = () => {
    selectedRowKeys.forEach((selectedItem) => {
      restoreCategory(selectedItem as string)
        .unwrap()
        .then(() => {
          messageAlert('Khôi phục thành công', 'success')
        })
        .catch(() => messageAlert('Khôi phục thất bại', 'error'))
    })
    setSelectedRowKeys([])
  }
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  }
  const hasSelected = selectedRowKeys.length > 1
  const columns: ColumnsType<ICategory> = [
    {
      title: '#',
      dataIndex: 'index',
      width: 50
    },
    {
      title: 'Tên danh mục',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => <span className='capitalize'>{name}</span>
    },

    {
      // title: <span className='block text-center'>Action</span>,
      key: 'action',
      // fixed: 'right',
      width: 200,
      render: (_, category) => (
        <div className='flex items-center justify-center'>
          <Space size='middle'>
            <Tooltip title='Khôi phục danh mục này'>
              <Popconfirm
                title='Bạn muốn khôi phục lại danh mục này?'
                description='Bạn thực sự muốn khôi phục lại danh mục này?'
                onConfirm={() => handleRestore(category._id)}
              >
                <ButtonAnt
                  size='large'
                  className='bg-primary hover:!text-white flex items-center justify-center text-white'
                  icon={<RedoOutlined className='text-lg' />}
                />
              </Popconfirm>
            </Tooltip>
            <Tooltip title='Xóa vĩnh viễn danh mục này'>
              <Popconfirm
                title='Bạn có muốn xóa VĨNH VIỄN danh mục này?'
                description='Hành động này sẽ không thể khôi phục lại!'
                okButtonProps={{ style: { backgroundColor: '#3C50E0', color: '#fff' } }}
                // onCancel={cancelDelete}
                onConfirm={() => handleDeleteReal(category._id)}
              >
                <ButtonAnt
                  size='large'
                  className='bg-meta-1 hover:!text-white flex items-center justify-center text-white'
                  icon={<BsFillTrashFill />}
                />
              </Popconfirm>
            </Tooltip>
          </Space>
        </div>
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
    <>
      <Space className='mb-4'>
        <Popconfirm
          title='Bạn thực sự muốn khôi phục những danh mục này?'
          description='Hành động này sẽ khôi phục những danh mục đang được chọn!'
          onConfirm={handleRestoreMany}
          onCancel={() => setSelectedRowKeys([])}
        >
          <ButtonAnt
            disabled={!hasSelected}
            size='large'
            className='bg-primary hover:!text-white flex items-center justify-center text-white'
          >
            Khôi phục tất cả
          </ButtonAnt>
        </Popconfirm>
        <Popconfirm
          title='Bạn thực sự muốn xóa VĨNH VIỄN những danh mục này?'
          description='Hành động này sẽ xóa những danh mục đang được chọn!'
          onConfirm={handleDeleteMany}
          onCancel={() => setSelectedRowKeys([])}
        >
          <ButtonAnt
            disabled={!hasSelected}
            size='large'
            className='bg-meta-1 hover:!text-white flex items-center justify-center text-white'
          >
            Xóa tất cả
          </ButtonAnt>
        </Popconfirm>
      </Space>

      <div className='dark:bg-graydark w-full overflow-x-auto'>
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
          scroll={{ y: '50vh', x: 650 }}
          bordered
          rowSelection={rowSelection}
        />
      </div>
    </>
  )
}

export default ListCategoryDeleted
