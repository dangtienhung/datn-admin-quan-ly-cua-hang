import { BsFillPencilFill, BsFillTrashFill } from 'react-icons/bs'
import { Button as ButtonAntd, Popconfirm, Space, Tooltip } from 'antd'
import { ICategoryBlog, IRoleUser } from '~/types'
import { RootState, useAppDispatch } from '~/store/store'
import { setCategoryBlog, setOpenDrawer } from '~/store/slices'

import { messageAlert } from '~/utils/messageAlert'
import { pause } from '~/utils/pause'
import { useAppSelector } from '~/store/hooks'
import { useDeleteCategoryBlogMutation } from '~/store/services'

export const useRenderCategoryBlog = () => {
  const dispatch = useAppDispatch()

  const [deleteCateBlog] = useDeleteCategoryBlogMutation()

  const { user } = useAppSelector((state: RootState) => state.persistedReducer.auth)

  const handleDelete = async (id: string) => {
    await pause(500)
    deleteCateBlog(id)
      .unwrap()
      .then(() => messageAlert('Xóa thành công', 'success'))
  }

  /* staff */
  const columnsStaff = [
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
    }
  ]

  /* admin */
  const columnsAdmin = [
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
  return user && user.role === IRoleUser.ADMIN ? columnsAdmin : columnsStaff
}
