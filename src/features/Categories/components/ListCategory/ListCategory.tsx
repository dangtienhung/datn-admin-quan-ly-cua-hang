import { BsFillPencilFill, BsFillTrashFill } from 'react-icons/bs'
import { HiDocumentDownload } from 'react-icons/hi'
import { Popconfirm, Space, Table, Button as ButtonAntd, message, Tooltip } from 'antd'
import { setCategory, setOpenDrawer } from '~/store/slices'
import { useDeleteFakeMutation, useGetAllCategoryQuery } from '~/store/services'

import { ColumnsType } from 'antd/es/table'
import { ICategory } from '~/types'
import Loading from '~/components/Loading/Loading'
import { NotFound } from '~/pages'
import { cancelDelete } from '../..'
import { messageAlert } from '~/utils/messageAlert'
import { pause } from '~/utils/pause'
import { useAppDispatch } from '~/store/store'
import { useState } from 'react'
import { exportDataToExcel } from '~/utils'

const ListCategory = () => {
  const [options, setOptions] = useState({ _page: 1, _limit: 10 })
  const { data: categories, isError, isLoading } = useGetAllCategoryQuery(options)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [deleteFakeCategory] = useDeleteFakeMutation()
  const dispatch = useAppDispatch()

  const handleDelete = async (id: string) => {
    await pause(2000)
    deleteFakeCategory(id)
      .unwrap()
      .then(() => messageAlert('Xóa thành công', 'success'))
      .catch(() => cancelDelete())
  }
  const handleDeleteMany = () => {
    selectedRowKeys.forEach((selectedItem) => {
      deleteFakeCategory(selectedItem as string)
        .unwrap()
        .then(() => {
          messageAlert('Xóa thành công', 'success')
          setSelectedRowKeys([])
        })
        .catch(() => cancelDelete())
    })
  }

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  }
  const hasSelected = selectedRowKeys.length > 1

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
      // title: <span className='block text-center'>Action</span>,
      key: 'action',
      width: 200,
      // fixed: 'right',

      render: (_, category) => (
        <div className='flex items-center justify-center'>
          <Space size='middle'>
            <Tooltip title='Sửa danh mục'>
              <ButtonAntd
                size='large'
                className='bg-primary hover:!text-white flex items-center justify-center text-white'
                icon={<BsFillPencilFill />}
                onClick={() => {
                  dispatch(setCategory({ _id: category._id, name: category.name }))
                  dispatch(setOpenDrawer(true))
                }}
              />
            </Tooltip>

            <Tooltip title='Xóa danh mục'>
              <Popconfirm
                title='Bạn có muốn xóa danh mục này?'
                description='Bạn chắc chắn muốn xóa danh mục này?'
                okButtonProps={{ style: { backgroundColor: '#3C50E0', color: '#fff' } }}
                // onCancel={cancelDelete}
                onConfirm={() => handleDelete(category._id)}
              >
                <ButtonAntd
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

  const categorriesData = categories?.docs.map((item: ICategory, index: number) => ({
    ...item,
    key: item._id,
    index: index + 1
  }))
  return (
    <>
      <Space>
        <Popconfirm
          title='Bạn thực sự muốn xóa những danh mục này?'
          description='Hành động này sẽ xóa những danh mục đang được chọn!'
          onConfirm={handleDeleteMany}
          onCancel={() => setSelectedRowKeys([])}
        >
          <ButtonAntd
            size='large'
            type='primary'
            danger
            className='text-sm font-semibold capitalize'
            disabled={!hasSelected}
            // loading={loading}
          >
            Xóa tất cả
          </ButtonAntd>
        </Popconfirm>
        <ButtonAntd
          icon={<HiDocumentDownload />}
          size='large'
          className='bg-[#209E62] text-white hover:!text-white text-sm font-semibold capitalize flex items-center'
          onClick={() => {
            if (categories?.docs?.length === 0) {
              message.warning('Không có danh mục nào để xuất')
              return
            }
            exportDataToExcel(categories?.docs, 'Category')
          }}
        >
          Xuất excel
        </ButtonAntd>
      </Space>
      <div className='dark:bg-graydark mt-3'>
        <Table
          columns={columns}
          dataSource={categorriesData}
          pagination={{
            pageSize: categories && categories.limit,
            // showSizeChanger: true,
            // pageSizeOptions: ['5', '10', '15', '20'],
            total: categories && categories?.totalDocs,
            onChange(page) {
              setOptions((prev) => ({ ...prev, _page: page }))
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

export default ListCategory
