import { BsFillPencilFill, BsFillTrashFill } from 'react-icons/bs'
import { Popconfirm, Space, Table } from 'antd'
import { RootState, useAppDispatch } from '~/store/store'

import { Button } from '~/components'
import { ISize } from '~/types'
import { formatCurrency } from '~/utils'
import { setOpenDrawer } from '~/store/slices'
import { useAppSelector } from '~/store/hooks'

export const ListSizes = () => {
  const dispatch = useAppDispatch()
  const { sizeList } = useAppSelector((state: RootState) => state.sizes)

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `${formatCurrency(price)}`
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      width: 300,
      render: (_: any, size: ISize) => (
        <Space size='middle'>
          <Button
            icon={<BsFillPencilFill />}
            onClick={() => {
              dispatch(setOpenDrawer(true))
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title='Bạn có muốn xóa topping này?'
            description='Are you sure to delete this task?'
            okButtonProps={{ style: { backgroundColor: '#3C50E0', color: '#fff' } }}
            okText='Có'
            cancelText='Không'
          >
            <Button variant='danger' icon={<BsFillTrashFill />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  const sizes = sizeList.map((size) => ({ ...size, key: size._id }))

  return (
    <div className='dark:bg-graydark'>
      <Table columns={columns} dataSource={sizes} />
    </div>
  )
}
