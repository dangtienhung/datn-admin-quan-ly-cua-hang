import 'react-quill/dist/quill.snow.css'

import { BsFillTrashFill } from 'react-icons/bs'
import { Button as ButtonAnt, Popconfirm, Space, Table, Tag, Tooltip, message } from 'antd'
import { RootState, useAppDispatch } from '~/store/store'
import { setBlogId, setOpenDrawer } from '~/store/slices'
import { useDeleteBlogMutation, useGetAllBlogsDeletedQuery, useUpdateIsDeletedBlogMutation } from '~/store/services'

import { Button } from '~/components'
import { IBlogs, ICategoryBlogRefBlog } from '~/types'
import Loading from '~/components/Loading/Loading'
import { NotFound } from '~/pages'
import { messageAlert } from '~/utils/messageAlert'
import parse from 'html-react-parser'
import { useAppSelector } from '~/store/hooks'
import { useState } from 'react'
import clsxm from '~/utils/clsxm'
import { RedoOutlined } from '@ant-design/icons'
import { pause } from '~/utils/pause'

const ListBlogDeleted = () => {
  const dispatch = useAppDispatch()
  const [currentPage, setCurrentPage] = useState(1)
  const { openDrawer } = useAppSelector((state: RootState) => state.drawer)
  const { data: BlogDataDeleted, isLoading, isError } = useGetAllBlogsDeletedQuery(currentPage)
  const [updateDeletedBlog] = useUpdateIsDeletedBlogMutation()
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [deleteBlog] = useDeleteBlogMutation()
  const handleDelete = async (id: string) => {
    try {
      await deleteBlog(id).then(() => {
        message.success('Xóa thành công!')
      })
    } catch (error) {
      message.error('Xoá thất bại!')
    }
  }
  const handleDeleteMany = async () => {
    selectedRowKeys.forEach((selectedItems) => {
      deleteBlog(selectedItems as string)
        .unwrap()
        .then(() => {
          messageAlert('Xóa thành công', 'success')
          setSelectedRowKeys([])
        })
        .catch(() => messageAlert('Xóa thất bại', 'error'))
    })
  }
  const handleRestore = async (_id: string) => {
    try {
      await pause(500)
      await updateDeletedBlog({ _id, status: false }).then(() => {
        message.success('Khôi phục bài viết thành công!')
      })
    } catch (error) {
      message.error('Khôi phục thất bại')
    }
  }
  const blogs = BlogDataDeleted?.docs?.map((blog) => ({
    ...blog,
    key: blog._id
  }))
  // console.log(blogs)

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    // console.log('selectedRowKeys changed: ', newSelectedRowKeys)
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  }
  const hasSelected = selectedRowKeys.length > 0
  if (isLoading) return <Loading />
  if (isError) return <NotFound />
  const columns = [
    {
      title: 'Tên bài viết',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, blog: IBlogs) => (
        <div className='grid grid-cols-[1fr,3fr] gap-5'>
          <div
            className='w-25 h-25 rounded-xl object-cover cursor-pointer'
            onClick={() => {
              dispatch(setOpenDrawer(!openDrawer)), dispatch(setBlogId(blog._id))
            }}
          >
            <img
              className='w-25 h-25 rounded-xl object-cover cursor-pointer'
              src={blog.images[0].url}
              alt={blog.name}
            />
          </div>
          <div className='flex flex-col gap-0.5 justify-center items-start'>
            <Tag color={clsxm({ success: !blog.is_deleted }, { red: blog.is_deleted })}>
              {blog.is_deleted ? 'Đã xóa' : 'Đang hoạt động'}
            </Tag>
            <div
              className='hover:underline flex-1 text-base capitalize cursor-pointer'
              onClick={() => {
                dispatch(setOpenDrawer(true)), dispatch(setBlogId(blog._id))
              }}
            >
              {name}
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Danh mục bài viết',
      dataIndex: 'category',
      key: 'category',
      width: 150,
      render: (category: ICategoryBlogRefBlog) => (
        <div className='line-clamp-3 text-base'>{category?.name || 'Không có dữ liệu'}</div>
      )
    },
    {
      title: 'Mô tả blog',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => <div className='line-clamp-3 text-base'>{parse(text)}</div>
    },
    {
      title: <span className='block text-center'>Action</span>,
      key: 'action',
      width: 150,
      render: (_: any, blog: IBlogs) => (
        <div className='flex items-center justify-center'>
          <Space size='middle'>
            <Tooltip title='Khôi phục bài viết này'>
              <Popconfirm
                title='Khôi phục lại bài viết'
                description='Bạn thực sự muốn khôi phục lại bài viết?'
                onConfirm={() => handleRestore(blog._id)}
              >
                <ButtonAnt
                  size='large'
                  className='bg-primary hover:!text-white flex items-center justify-center text-white'
                  icon={<RedoOutlined className='text-lg' />}
                />
              </Popconfirm>
            </Tooltip>

            <Tooltip title='Xóa bài viêt này'>
              <Popconfirm
                title='Xóa vĩnh viễn bài viết?'
                description='Bạn chắc chắn muốn xóa bài viết?'
                okButtonProps={{ style: { backgroundColor: '#3C50E0', color: '#fff' } }}
                onConfirm={() => handleDelete(blog._id!)}
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
  return (
    <div>
      <Space>
        <Popconfirm
          title='Bạn thực sự muốn xóa những danh mục này?'
          description='Hành động này sẽ xóa vĩnh viễn những danh mục đang được chọn!'
          onConfirm={handleDeleteMany}
          className='ml-[10px]'
        >
          <Button variant='danger' disabled={!hasSelected}>
            Xóa tất cả
          </Button>
        </Popconfirm>
      </Space>
      <Table
        className='dark:bg-graydark mt-4'
        columns={columns}
        dataSource={blogs}
        pagination={{
          pageSize: BlogDataDeleted && BlogDataDeleted?.limit,
          total: BlogDataDeleted && BlogDataDeleted?.totalDocs,
          onChange(page) {
            setCurrentPage(page)
          }
        }}
        rowSelection={rowSelection}
        scroll={{ y: '60vh', x: 1000 }}
        bordered
      />
    </div>
  )
}

export default ListBlogDeleted