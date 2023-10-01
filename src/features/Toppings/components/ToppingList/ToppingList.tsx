import { BsFillPencilFill, BsFillTrashFill } from 'react-icons/bs'
import { Popconfirm, Space, Table, message } from 'antd'

import { Button } from '~/components'
import { ColumnsType } from 'antd/es/table'
import { ITopping } from '~/types'
import { RootState } from '~/store/store'
import { cancelDelete } from '../..'
import { formatCurrency } from '~/utils'
import { useAppSelector } from '~/store/hooks'
import { useDeleteToppingMutation } from '~/store/services'

const ToppingList = () => {
  const { toppingsList } = useAppSelector((state: RootState) => state.toppings)
  const [deleteTopping, _] = useDeleteToppingMutation()

  const handleDelete = async (id: string) => {
    try {
      await deleteTopping(id).then(() => {
        message.success('Xoá thành công!')
      })
    } catch (error) {
      message.error('Xoá thất bại!')
    }
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
      title: 'Action',
      key: 'action',
      fixed: 'right',
      width: 300,
      render: (_, topping: ITopping) => (
        <Space size='middle'>
          <Button icon={<BsFillPencilFill />}>Sửa</Button>
          <Popconfirm
            title='Bạn có muốn xóa topping này?'
            description='Are you sure to delete this task?'
            onConfirm={() => handleDelete(topping._id)}
            onCancel={cancelDelete}
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

  const toppings = toppingsList.map((topping) => ({ ...topping, key: topping._id }))

  return (
    <div className='dark:bg-graydark'>
      <Table columns={columns} dataSource={toppings} />
    </div>
  )
}

export default ToppingList
