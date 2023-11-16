import { Popconfirm, Space, Table, Tooltip, Button as ButtonAntd, message } from 'antd'
import { useDeleteCategoryBlogMutation, useGetAllCategoryBlogQuery } from '~/store/services'
import { BsFillPencilFill, BsFillTrashFill } from 'react-icons/bs'
import { setCategoryBlog, setOpenDrawer } from '~/store/slices'
import { HiDocumentDownload } from 'react-icons/hi'

import { NotFound } from '~/pages'
import Loading from '~/components/Loading/Loading'
import { useAppDispatch } from '~/store/store'
import { ICategoryBlog } from '~/types'
import { messageAlert } from '~/utils/messageAlert'
import { pause } from '~/utils/pause'
import { useState } from 'react'
import { exportDataToExcel } from '~/utils'

const ListCategoryBlog = () => {
  const dispatch = useAppDispatch()
  const [options, setOption] = useState({ _page: 1, _limit: 10 })
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const { data: categoryBlog, isError, isLoading } = useGetAllCategoryBlogQuery(options)
  const [deleteCateBlog] = useDeleteCategoryBlogMutation()
  console.log(categoryBlog)

  const handleDelete = async (id: string) => {
    await pause(500)
    deleteCateBlog(id)
      .unwrap()
      .then(() => messageAlert('Xóa thành công', 'success'))
  }
  const handleDeleteMany = async () => {
    await pause(1000)
    selectedRowKeys.forEach((selectedItem) => {
      deleteCateBlog(selectedItem as string)
        .unwrap()
        .then(() => {
          messageAlert('Xóa thành công', 'success')
          setSelectedRowKeys([])
        })
    })
  }
  const hasSelected = selectedRowKeys.length > 0
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys)
    setSelectedRowKeys(newSelectedRowKeys)
  }
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  }
  const categoryData = categoryBlog?.docs?.map((category, index) => ({
    ...category,
    key: category._id,
    index: index + 1
  }))
  if (isLoading) return <Loading />
  if (isError) return <NotFound />
  const columns = [
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
      render: (name: string) => <p className='uppercase'>{name}</p>
    },

    {
      key: 'action',
      width: 200,
      render: (_: any, category: ICategoryBlog) => (
        <div className='flex items-center justify-center'>
          <Space size='middle'>
            <Tooltip title='Cập nhật danh mục này'>
              <ButtonAntd
                size='large'
                className='bg-primary hover:!text-white flex items-center justify-center text-white'
                icon={<BsFillPencilFill />}
                onClick={() => {
                  dispatch(setCategoryBlog({ _id: category._id, name: category.name }))
                  dispatch(setOpenDrawer(true))
                }}
              />
            </Tooltip>
            <Tooltip title='Xóa danh mục này'>
              <Popconfirm
                title='Bạn có muốn xóa danh mục này?'
                description='Bạn chắc chắn muốn xóa danh mục này?'
                okButtonProps={{ style: { backgroundColor: '#3C50E0', color: '#fff' } }}
                okText='Có'
                cancelText='Không'
                onConfirm={() => handleDelete(category._id!)}
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
          >
            Xóa tất cả
          </ButtonAntd>
        </Popconfirm>
        <ButtonAntd
          icon={<HiDocumentDownload />}
          size='large'
          className='bg-[#209E62] text-white hover:!text-white text-sm font-semibold capitalize flex items-center'
          onClick={() => {
            if (categoryBlog?.docs?.length === 0) {
              message.warning('Không có danh mục nào để xuất')
              return
            }
            exportDataToExcel(categoryBlog?.docs, 'Category Blog')
          }}
        >
          Xuất excel
        </ButtonAntd>
      </Space>
      <div className='dark:bg-graydark mt-3'>
        <Table
          columns={columns}
          dataSource={categoryData}
          pagination={{
            pageSize: categoryBlog && categoryBlog.limit,
            total: categoryBlog && categoryBlog?.totalDocs,
            onChange(page) {
              setOption((prev) => ({ ...prev, _page: page }))
            }
          }}
          rowSelection={rowSelection}
        ></Table>
      </div>
    </>
  )
}

export default ListCategoryBlog
