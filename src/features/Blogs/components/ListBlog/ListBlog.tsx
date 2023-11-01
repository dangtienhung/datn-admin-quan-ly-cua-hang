import { Popconfirm, Space, Table, message, Button as ButtonAnt, Tooltip } from 'antd'
import { useState } from 'react'
import { BsFillPencilFill, BsFillTrashFill } from 'react-icons/bs'
import { Button } from '~/components'
import Loading from '~/components/Loading/Loading'
import { NotFound } from '~/pages'
import { useDeleteBlogMutation, useGetAllBlogsQuery } from '~/store/services'
import { setBlog, setOpenDrawer } from '~/store/slices'
import { useAppDispatch } from '~/store/store'
import { IBlogs } from '~/types'
import { truncateDescription } from '../../utils'
import { messageAlert } from '~/utils/messageAlert'
import ReactHtmlParser from 'html-react-parser'
import 'react-quill/dist/quill.snow.css'

const ListBlog = () => {
  const dispatch = useAppDispatch()
  const [currentPage, setCurrentPage] = useState(1)
  const { data: BlogData, isLoading, isError } = useGetAllBlogsQuery(currentPage)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [deleteBlog] = useDeleteBlogMutation()
  console.log(BlogData)
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
  const blogs = BlogData?.docs?.map((blog) => ({
    ...blog,
    key: blog._id
  }))

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
      title: 'Tên blog',
      dataIndex: 'name',
      key: 'name'
      // render: (name: string) => <span className='uppercase'>{name}</span>
    },
    {
      title: 'Ảnh blog',
      dataIndex: 'images',
      key: 'images',

      render: (image: any) => <img className='w-full max-w-[350px]' src={image[0]?.url} alt='' />
    },
    {
      title: 'Mô tả blog',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => <div>{truncateDescription(ReactHtmlParser(text) as any, 120)}</div>
    },
    {
      title: <span className='block text-center'>Action</span>,
      key: 'action',
      width: 300,
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
          pageSize: BlogData && BlogData?.limit,
          total: BlogData && BlogData?.totalDocs,
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

export default ListBlog
