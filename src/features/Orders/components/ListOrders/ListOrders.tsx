import Loading from '~/components/Loading/Loading'
import { Space, Table } from 'antd'
import { Button } from '~/components'
import { ColumnsType } from 'antd/es/table'
import { NotFound } from '~/pages'
import { useState } from 'react'
import { useConfirmOrderMutation, useGetAllOrderQuery } from '~/store/services/Orders'
import { formatDate } from '~/utils/formatDate'
import { EyeFilled, CloseCircleFilled, CheckCircleFilled } from '@ant-design/icons'
import UserInfoRow from '../UserInfoRow/UserInfoRow'
import { useAppDispatch } from '~/store/store'
import { setOpenDrawer } from '~/store/slices'
import { setIdOrderCancel, setOrderData } from '~/store/slices/Orders/order.slice'
import { messageAlert } from '~/utils/messageAlert'
import { setOpenModal } from '~/store/slices/Modal'

const ListOrders = () => {
  const dispatch = useAppDispatch()
  const [options, setoptions] = useState({
    page: 1,
    limit: 10
  })
  const { data: orders, isLoading, isError } = useGetAllOrderQuery(options)
  const [confirmOrder] = useConfirmOrderMutation()
  const onConfirmOrder = (id: string) => {
    confirmOrder(id)
      .unwrap()
      .then(() => {
        messageAlert('Thay đổi trạng thái thành công', 'success', 4)
      })
      .catch(() => messageAlert('Thay đổi trạng thái thất bại', 'error'))
  }

  if (isLoading) return <Loading />
  if (isError) return <NotFound />
  const columns: ColumnsType<any> = [
    {
      title: '#',
      dataIndex: 'index',
      width: 50,
      defaultSortOrder: 'ascend',
      sorter: (a, b) => a.index - b.index
    },
    {
      title: 'Thông tin người đặt',
      dataIndex: 'user',
      key: 'user',
      rowScope: 'row',
      sorter: (a, b) => {
        return a.user.username.localeCompare(b.user.username)
      },
      render: (user: any) => <UserInfoRow user={user} />
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note'

      // render: (name: string) => <span className='capitalize'>{name}</span>
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span
          className={`text-white capitalize font-semibold ${
            status === 'canceled'
              ? 'bg-meta-1'
              : status === 'pending'
              ? 'bg-meta-6'
              : status === 'done' || status === 'confirmed'
              ? 'bg-meta-3'
              : 'bg-meta-5'
          } rounded inline-block px-2 py-1`}
        >
          {status}
        </span>
      ),
      filters: [
        {
          text: 'Hoàn thành',
          value: 'done'
        },
        {
          text: 'Đang chờ',
          value: 'pending'
        },
        {
          text: 'Đã hủy',
          value: 'canceled'
        },
        {
          text: 'Đã xác nhận',
          value: 'confirmed'
        }
      ],
      onFilter(value, record) {
        return record.status.startsWith(value)
      }
    },
    {
      title: 'Thời gian đặt hàng',
      dataIndex: 'timeOrder',
      key: 'timeOrder',
      sorter: (a, b) => a.timeOrder.localeCompare(b.timeOrder),
      sortDirections: ['descend', 'ascend'],
      render: (time: string) => <span className='capitalize'>{formatDate(time)}</span>
    },

    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      render: (_: any, order) => (
        <Space size='middle'>
          {order.status === 'pending' && (
            <Button
              variant='success'
              icon={<CheckCircleFilled />}
              onClick={() => {
                onConfirmOrder(order.key)
              }}
            />
          )}

          <Button
            icon={<EyeFilled />}
            onClick={() => {
              // dispatch(setCategory({ _id: category._id, name: category.name }))
              dispatch(setOpenDrawer(true))
              dispatch(setOrderData({ ...order }))
            }}
          />
          {order.status === 'pending' ||
            (order.status === 'confirmed' && (
              <Button
                variant='danger'
                icon={<CloseCircleFilled />}
                onClick={() => {
                  dispatch(setOpenModal(true))
                  dispatch(setIdOrderCancel(order.key))
                }}
              />
            ))}
        </Space>
      )
    }
  ]
  const ordersData = orders?.docs.map((item: any, index: number) => ({
    user: {
      username: item.inforOrderShipping?.name,
      phone: item.inforOrderShipping?.phone,
      avatar: item.user?.avatar,
      address: item.inforOrderShipping?.address
    },
    payment: item.paymentMethodId,
    // username: item.inforOrderShipping.name,
    note: item.inforOrderShipping.noteShipping,
    priceShip: item.priceShipping,
    products: item.items,
    totalPrice: item.total,
    status: item.status,
    timeOrder: item.createdAt,
    key: item._id,
    index: index + 1,
    reasonCancelOrder: item?.reasonCancelOrder ? item.reasonCancelOrder : ''
  }))

  return (
    <div className='dark:bg-graydark'>
      <Table
        columns={columns}
        dataSource={ordersData}
        pagination={{
          pageSize: orders && orders.limit,
          showSizeChanger: true,
          pageSizeOptions: ['10', '15', '20', '25'],
          total: orders && orders?.totalDocs,
          onChange(page, pageSize) {
            setoptions((prev) => ({ ...prev, page, limit: pageSize }))
          }
        }}
        scroll={{ y: '50vh' }}
        bordered
      />
    </div>
  )
}

export default ListOrders
