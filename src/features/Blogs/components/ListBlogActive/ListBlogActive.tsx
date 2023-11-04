import 'react-quill/dist/quill.snow.css'

import { BsFillPencilFill, BsFillTrashFill } from 'react-icons/bs'
import { Button as ButtonAnt, Popconfirm, Space, Table, Tag, Tooltip, message } from 'antd'
import { RootState, useAppDispatch } from '~/store/store'
import { setBlog, setBlogId, setOpenDrawer } from '~/store/slices'
import { useDeleteBlogMutation, useGetAllBlogsActiveQuery } from '~/store/services'

import { Button } from '~/components'
import { IBlogs } from '~/types'
import Loading from '~/components/Loading/Loading'
import { NotFound } from '~/pages'
import { messageAlert } from '~/utils/messageAlert'
import parse from 'html-react-parser'
import { useAppSelector } from '~/store/hooks'
import { useState } from 'react'
import clsxm from '~/utils/clsxm'

const ListBlogActive = () => {
  const dispatch = useAppDispatch()
  const [currentPage, setCurrentPage] = useState(1)
  const { openDrawer } = useAppSelector((state: RootState) => state.drawer)
  const { data: BlogDatactive, isLoading, isError } = useGetAllBlogsActiveQuery(currentPage)

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
    })
  }
  const blogs = BlogDatactive?.docs?.map((blog) => ({
    ...blog,
    key: blog._id
  }))
  console.log(blogs)

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys)
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
            <Tag
              color={clsxm(
                { success: !blog.is_deleted && blog.is_active },
                { '#333': blog.is_deleted },
                { red: !blog.is_deleted && !blog.is_active }
              )}
            >
              {blog.is_active && !blog.is_deleted ? 'Đang hoạt động' : 'Không hoạt động'}
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
      title: 'Mô tả blog',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => <div className='line-clamp-3 text-base'>{parse(text)}</div>
    },
    {
      title: <span className='block text-center'>Action</span>,
      key: 'action',
      width: 200,
      render: (_: any, blog: IBlogs) => (
        <div className='flex items-center justify-center'>
          <Space size='middle'>
            <Tooltip title='Sủa bài viết này'>
              <ButtonAnt
                size='large'
                className='bg-primary hover:!text-white flex items-center justify-center text-white'
                icon={<BsFillPencilFill />}
                onClick={() => {
                  dispatch(setBlog(blog))
                  dispatch(setOpenDrawer(true))
                }}
              />
            </Tooltip>

            <Tooltip title='Xóa bài viêt này'>
              <Popconfirm
                title='Bạn có muốn xóa bài viết này?'
                description='Bạn chắc chắn muốn xóa bài viết này?'
                okButtonProps={{ style: { backgroundColor: '#3C50E0', color: '#fff' } }}
                // okText='Có'
                // cancelText='Không'
                // onCancel={cancelDelete}
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
          description='Hành động này sẽ xóa những danh mục đang được chọn!'
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
          pageSize: BlogDatactive && BlogDatactive?.limit,
          total: BlogDatactive && BlogDatactive?.totalDocs,
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

export default ListBlogActive
