import { Button as ButtonAntd, Popconfirm, Space, Table, Tooltip, message } from 'antd'
import { BsFillPencilFill, BsFillTrashFill } from 'react-icons/bs'
import { setOpenDrawer, setToppingId } from '~/store/slices'
import { RootState, useAppDispatch } from '~/store/store'
import { IRoleUser, ITopping } from '~/types'
import { formatCurrency } from '~/utils'

import { ColumnsType } from 'antd/es/table'
import { useState } from 'react'
import { useAppSelector } from '~/store/hooks'
import { useDeleteToppingMutation } from '~/store/services'
import { cancelDelete } from '../..'
import { useRenderTopping } from '../../hooks'

const ToppingList = () => {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state: RootState) => state.persistedReducer.auth)
  const { toppingsList } = useAppSelector((state: RootState) => state.toppings)

  const [deleteTopping] = useDeleteToppingMutation()

  /* topping delete */
  const handleDelete = async (id: string) => {
    try {
      await deleteTopping({ id }).then(() => {
        message.success('Xoá thành công!')
      })
    } catch (error) {
      message.error('Xoá thất bại!')
    }
  }

  /* edit topping */
  const saveToppingId = (id: string) => {
    dispatch(setToppingId(id))
  }

  const [loading, setLoading] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const start = () => {
    setLoading(true)
    setTimeout(() => {
      selectedRowKeys.forEach((selectedItem) => {
        deleteTopping({ id: selectedItem as string })
          .unwrap()
          .then(() => {
            message.success('Xóa thành công')
            setSelectedRowKeys([])
          })
      })
      setLoading(false)
    }, 1000)
  }

  const hasSelected = selectedRowKeys.length > 1
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys)
    setSelectedRowKeys(newSelectedRowKeys)
  }
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  }

  const columns: ColumnsType<ITopping> = [
    {
      title: 'Tên topping',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => <span className='capitalize'>{name}</span>
    },
    { title: 'Giá topping', dataIndex: 'price', key: 'price', render: (price: number) => `${formatCurrency(price)}` },
    {
      // title: <span className='block text-center'>Action</span>,
      key: 'action',
      fixed: 'right',
      width: 200,
      render: (_, topping: ITopping) => (
        <div className='flex items-center justify-center'>
          <Space size='middle'>
            <Tooltip title='Cập nhật topping này'>
              <ButtonAntd
                size='large'
                className='bg-primary hover:!text-white flex items-center justify-center text-white'
                icon={<BsFillPencilFill />}
                onClick={() => {
                  dispatch(setOpenDrawer(true)), saveToppingId(topping._id)
                }}
              />
            </Tooltip>
            <Tooltip title='Xoá topping này'>
              <Popconfirm
                title='Bạn có muốn xóa topping này?'
                description='Are you sure to delete this task?'
                onConfirm={() => handleDelete(topping._id)}
                onCancel={cancelDelete}
                okButtonProps={{ style: { backgroundColor: '#3C50E0', color: '#fff' } }}
                okText='Có'
                cancelText='Không'
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

  const toppings = toppingsList.map((topping, index) => ({ ...topping, key: topping._id, index: index }))

  const toppingData = useRenderTopping(toppings)

  return (
    <div>
      <Space>
        {user && user.role === IRoleUser.ADMIN && hasSelected && (
          <Popconfirm
            title='Bạn thực sự muốn xóa những topping này?'
            description='Hành động này sẽ xóa những topping đang được chọn!'
            onConfirm={start}
            className='ml-[10px]'
          >
            <ButtonAntd
              size='large'
              type='primary'
              danger
              className='text-sm font-semibold capitalize'
              loading={loading}
            >
              Xóa tất cả
            </ButtonAntd>
          </Popconfirm>
        )}
        {/* <ButtonAntd
          icon={<HiDocumentDownload />}
          size='large'
          className='bg-[#209E62] text-white hover:!text-white text-sm font-semibold capitalize flex items-center'
          onClick={() => {
            if (toppingsList?.length === 0) {
              message.warning('Không có sản phẩm nào để xuất')
              return
            }
            exportDataToExcel(toppingsList, 'Toppings')
          }}
        >
          Xuất excel
        </ButtonAntd> */}
      </Space>
      <Table
        className='dark:bg-graydark mt-3'
        // columns={columns}
        columns={toppingData}
        dataSource={toppings}
        pagination={{
          pageSize: 5,
          showSizeChanger: false,
          pageSizeOptions: ['5', '10', '15', '20']
        }}
        rowSelection={user.role === IRoleUser.ADMIN ? rowSelection : undefined}
        bordered
      />
    </div>
  )
}

export default ToppingList
