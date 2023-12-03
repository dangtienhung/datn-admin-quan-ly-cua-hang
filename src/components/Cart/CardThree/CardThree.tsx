import { Bar, BarChart, CartesianGrid, Legend, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import {
  Button as ButtonAnt,
  Drawer,
  Input,
  InputRef,
  Popconfirm,
  Select,
  Space,
  Table,
  Tooltip as TooltipAntd
} from 'antd'
import { CheckOutlined, CloseCircleFilled, EyeFilled, SearchOutlined } from '@ant-design/icons'
import { IAnalticRevenueMonth, IAnalticRevenueWeek, IAnalytics, IOrderDataType } from '~/types'
import { RootState, useAppDispatch } from '~/store/store'
import { setIdOrderCancel, setOrderData } from '~/store/slices/Orders'
import { setOpenDrawer, setOpenModal } from '~/store/slices'
import { useConfirmOrderMutation, useGetAnalystMonthQuery } from '~/store/services'
import { useEffect, useMemo, useRef, useState } from 'react'

import { Button } from '~/components'
import { ClientSocket } from '~/socket'
import { ColumnType } from 'antd/lib/table'
import { ColumnsType } from 'antd/es/table'
import type { FilterConfirmProps } from 'antd/es/table/interface'
import Highlighter from 'react-highlight-words'
import TableChildrend from '~/features/Products/utils/tableChildrend'
import UserInfoRow from '~/features/Orders/components/UserInfoRow/UserInfoRow'
import { formatCurrency } from '~/utils'
import { formatDate } from '~/utils/formatDate'
import { messageAlert } from '~/utils/messageAlert'
import { renderOrderStatus } from '~/features'
import { useAppSelector } from '~/store/hooks'
import { v4 as uuid } from 'uuid'

interface CardThreeProps {
  data: IAnalytics
}

type DataIndex = keyof IOrderDataType

const CardThree = ({ data }: CardThreeProps) => {
  const dispatch = useAppDispatch()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [index, setIndex] = useState(0)
  const [statusOrder, setStatusOrder] = useState('pending')
  const searchInput = useRef<InputRef>(null)
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  const { data: dataAnalytics3, isError: errorAnalytics3 } = useGetAnalystMonthQuery()

  const dataAhihih = [
    {
      name: dataAnalytics3?.orders[0].analytics[0].name,
      'tuần 1': dataAnalytics3?.orders[0].analytics[0].analytics[index].totalRevenue,
      'tuần 2': dataAnalytics3?.orders[0].analytics[0].analytics[1].totalRevenue,
      'tuần 3': dataAnalytics3?.orders[0].analytics[0].analytics[2].totalRevenue,
      'tuần 4': dataAnalytics3?.orders[0].analytics[0].analytics[3].totalRevenue
    },
    {
      name: dataAnalytics3?.orders[0].analytics[1].name,
      'tuần 1': dataAnalytics3?.orders[0].analytics[1].analytics[index].totalRevenue,
      'tuần 2': dataAnalytics3?.orders[0].analytics[0].analytics[1].totalRevenue,
      'tuần 3': dataAnalytics3?.orders[0].analytics[0].analytics[2].totalRevenue,
      'tuần 4': dataAnalytics3?.orders[0].analytics[0].analytics[3].totalRevenue
    },
    {
      name: dataAnalytics3?.orders[0].analytics[2].name,
      'tuần 1': dataAnalytics3?.orders[0].analytics[2].analytics[index].totalRevenue,
      'tuần 2': dataAnalytics3?.orders[0].analytics[0].analytics[1].totalRevenue,
      'tuần 3': dataAnalytics3?.orders[0].analytics[0].analytics[2].totalRevenue,
      'tuần 4': dataAnalytics3?.orders[0].analytics[0].analytics[3].totalRevenue
    },
    {
      name: dataAnalytics3?.orders[0].analytics[3].name,
      'tuần 1': dataAnalytics3?.orders[0].analytics[3].analytics[index].totalRevenue,
      'tuần 2': dataAnalytics3?.orders[0].analytics[0].analytics[1].totalRevenue,
      'tuần 3': dataAnalytics3?.orders[0].analytics[0].analytics[2].totalRevenue,
      'tuần 4': dataAnalytics3?.orders[0].analytics[0].analytics[3].totalRevenue
    }
  ]

  const handleChange = (value: string) => {
    setIndex(Number(value))
  }

  const dataAnalyticMonth = (dataAnalytics3?.orders[1]?.analytics[0] as any)
    ? (dataAnalytics3?.orders[1]?.analytics[0] as any)[statusOrder].map((item: IAnalticRevenueMonth) => ({
        name: `tháng ${item.month}`,
        'Doanh thu': item.totalRevenue
      }))
    : []

  const handleChangeAnalyticMonth = (value: string) => {
    setStatusOrder(value)
  }

  const { user } = useAppSelector((state: RootState) => state.persistedReducer.auth)
  const { orderDate } = useAppSelector((state) => state.orders)
  const [pendingOrder, setPendingOrder] = useState<any>()
  const [options, setoptions] = useState({
    page: 1,
    limit: 10,
    startDate: '',
    endDate: '',
    room: user._id
  })

  const memoOptions = useMemo(() => {
    setoptions((prev) => ({
      ...prev,
      page: 1,
      startDate: orderDate.startDate,
      endDate: orderDate.endDate
    }))
  }, [orderDate])

  useEffect(() => {
    ClientSocket.getPendingOrder(setPendingOrder, options)
  }, [orderDate, memoOptions, options])

  const [confirmOrder] = useConfirmOrderMutation()

  if (errorAnalytics3) return <div>error</div>

  const onConfirmOrder = ({ idOrder, idUser }: { idOrder: string; idUser: string }) => {
    confirmOrder(idOrder)
      .unwrap()
      .then(() => {
        messageAlert('Thay đổi trạng thái thành công', 'success', 4)
        ClientSocket.sendNotification({
          idUser,
          idOrder,
          content: `Đơn hàng "${idOrder.toUpperCase()}" đã được xác nhận`
        })
      })
      .catch(() => messageAlert('Thay đổi trạng thái thất bại', 'error'))
  }

  const ordersData = pendingOrder?.docs.map((item: any, index: number) => ({
    user: {
      username: item.inforOrderShipping?.name,
      phone: item.inforOrderShipping?.phone,
      avatar: item.user?.avatar,
      address: item.inforOrderShipping?.address
    },
    payment: item.paymentMethodId,
    user_order: item?.user?._id,
    note: item.inforOrderShipping.noteShipping,
    priceShip: item.priceShipping,
    quantity: item.items.length,
    products: item.items,
    totalPrice: item.total,
    status: item.status,
    moneyPromotion: item.moneyPromotion,
    timeOrder: item.createdAt,
    key: item._id,
    index: index + 1,
    orderCode: item._id.toUpperCase()
  }))

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  }

  const onConfirmOrderMany = () => {
    selectedRowKeys.forEach((selectItem) => {
      confirmOrder(selectItem as string)
        .unwrap()
        .then(({ order }) => {
          messageAlert('Thay đổi trạng thái thành công', 'success', 4)
          if (order.user._id) {
            ClientSocket.sendNotification({
              idUser: order.user._id,
              idOrder: selectItem as string,
              content: `Đơn hàng "${(selectItem as string).toUpperCase()}" đã được xác nhận`
            })
          }
        })
        .catch(() => messageAlert('Thay đổi trạng thái thất bại', 'error'))
    })
    setSelectedRowKeys([])
  }

  const handleReset = (clearFilters: () => void) => {
    clearFilters()
    setSearchText('')
  }

  const hasSelected = selectedRowKeys.length > 2

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  }

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<IOrderDataType> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Tìm kiếm mã đơn hàng`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <ButtonAnt
            type='primary'
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size='small'
            style={{ width: 90 }}
          >
            Tìm kiếm
          </ButtonAnt>
          <ButtonAnt onClick={() => clearFilters && handleReset(clearFilters)} size='small' style={{ width: 90 }}>
            Làm mới
          </ButtonAnt>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100)
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString().substring(text.length - 8) : ''}
        />
      ) : (
        text.substring(text.length - 8)
      )
  })

  const columns: ColumnsType<any> = [
    // {
    //   title: '#',
    //   dataIndex: 'index',
    //   width: 40,
    //   defaultSortOrder: 'ascend',
    //   sorter: (a, b) => a.index - b.index
    // },
    {
      title: 'ID',
      dataIndex: 'orderCode',
      key: 'orderCode',
      width: 100,
      ...getColumnSearchProps('orderCode')
    },
    {
      title: 'Thông tin người đặt',
      dataIndex: 'user',
      key: 'user',
      width: 195,
      rowScope: 'row',
      sorter: (a, b) => {
        return a.user.username.localeCompare(b.user.username)
      },
      sortDirections: ['descend', 'ascend'],
      render: (user: any) => <UserInfoRow user={user} />
    },
    {
      title: 'Ảnh SP',
      dataIndex: 'products',
      key: 'products',
      width: 100,
      render: (item: any) => (
        <img src={item[0].image} className='object-cover w-20 h-20 rounded-lg cursor-pointer mb-1' alt='' />
      )
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 91,
      render: (quantity: number) => <p className='text-center'>{quantity}</p>
    },
    {
      title: 'Tổng Tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      width: 110,
      render: (totalPrice: number) => (
        <span
          className={`capitalize font-semibold
          rounded inline-block text-lg text-center py-1`}
        >
          {formatCurrency(+totalPrice)}
        </span>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (status: string, data: any) => (
        <span
          className={`text-white capitalize font-semibold bg-meta-6
          rounded inline-block px-2 py-1`}
        >
          {data.payment !== 'cod' && status == 'pending' ? 'Thanh toán' : 'Duyệt đơn'}
        </span>
      )
    },

    {
      title: 'Thời gian',
      dataIndex: 'timeOrder',
      key: 'timeOrder',
      width: 175,
      sorter: (a, b) => a.timeOrder.localeCompare(b.timeOrder),
      sortDirections: ['descend', 'ascend'],
      render: (time: string) => <span className='capitalize'>{formatDate(time)}</span>
    },

    {
      key: 'action',

      width: 150,
      render: (_: any, order) => (
        <div className='flex items-center justify-center'>
          <Space>
            <TooltipAntd title='Xem chi tiết đơn hàng'>
              <ButtonAnt
                size='large'
                className='bg-meta-6 hover:!text-white flex items-center justify-center text-white'
                icon={<EyeFilled />}
                onClick={() => {
                  // dispatch(setCategory({ _id: category._id, name: category.name }))
                  dispatch(setOpenDrawer(true))
                  dispatch(setOrderData({ ...order }))
                }}
              />
            </TooltipAntd>
            <TooltipAntd title='Xác nhận đơn hàng'>
              <ButtonAnt
                size='large'
                className='bg-meta-5 hover:!text-white flex items-center justify-center text-white'
                icon={<CheckOutlined />}
                onClick={() => {
                  onConfirmOrder({ idOrder: order.key, idUser: order.user_order })
                  ClientSocket.confirmOrder(order.key)
                }}
              />
            </TooltipAntd>

            <TooltipAntd title='Hủy đơn hàng'>
              {order && !order.user_order ? (
                <Popconfirm
                  title='Bạn muốn hủy đơn hàng này chứ ?'
                  onConfirm={() => dispatch(setIdOrderCancel(order.key))}
                  okText='Đồng ý'
                  cancelText='Hủy'
                >
                  <ButtonAnt
                    size='large'
                    className='bg-meta-1 hover:!text-white flex items-center justify-center text-white'
                    icon={<CloseCircleFilled />}
                  />
                </Popconfirm>
              ) : (
                <ButtonAnt
                  size='large'
                  className='bg-meta-1 hover:!text-white flex items-center justify-center text-white'
                  icon={<CloseCircleFilled />}
                  onClick={() => {
                    dispatch(setOpenModal(true))
                    dispatch(setIdOrderCancel(order.key))
                  }}
                />
              )}
            </TooltipAntd>
          </Space>
        </div>
      )
    }
  ]

  return (
    <>
      <div
        className='rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark cursor-pointer'
        onClick={() => setIsModalOpen(!isModalOpen)}
      >
        <div className='flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4'>
          <svg
            className='fill-primary dark:fill-white'
            width='22'
            height='22'
            viewBox='0 0 22 22'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M21.1063 18.0469L19.3875 3.23126C19.2157 1.71876 17.9438 0.584381 16.3969 0.584381H5.56878C4.05628 0.584381 2.78441 1.71876 2.57816 3.23126L0.859406 18.0469C0.756281 18.9063 1.03128 19.7313 1.61566 20.3844C2.20003 21.0375 2.99066 21.3813 3.85003 21.3813H18.1157C18.975 21.3813 19.8 21.0031 20.35 20.3844C20.9 19.7656 21.2094 18.9063 21.1063 18.0469ZM19.2157 19.3531C18.9407 19.6625 18.5625 19.8344 18.15 19.8344H3.85003C3.43753 19.8344 3.05941 19.6625 2.78441 19.3531C2.50941 19.0438 2.37191 18.6313 2.44066 18.2188L4.12503 3.43751C4.19378 2.71563 4.81253 2.16563 5.56878 2.16563H16.4313C17.1532 2.16563 17.7719 2.71563 17.875 3.43751L19.5938 18.2531C19.6282 18.6656 19.4907 19.0438 19.2157 19.3531Z'
              fill=''
            />
            <path
              d='M14.3345 5.29375C13.922 5.39688 13.647 5.80938 13.7501 6.22188C13.7845 6.42813 13.8189 6.63438 13.8189 6.80625C13.8189 8.35313 12.547 9.625 11.0001 9.625C9.45327 9.625 8.1814 8.35313 8.1814 6.80625C8.1814 6.6 8.21577 6.42813 8.25015 6.22188C8.35327 5.80938 8.07827 5.39688 7.66577 5.29375C7.25327 5.19063 6.84077 5.46563 6.73765 5.87813C6.6689 6.1875 6.63452 6.49688 6.63452 6.80625C6.63452 9.2125 8.5939 11.1719 11.0001 11.1719C13.4064 11.1719 15.3658 9.2125 15.3658 6.80625C15.3658 6.49688 15.3314 6.1875 15.2626 5.87813C15.1595 5.46563 14.747 5.225 14.3345 5.29375Z'
              fill=''
            />
          </svg>
        </div>

        <div className='mt-4 flex items-end justify-between'>
          <div>
            <h4 className='text-title-md font-bold text-black dark:text-white'>{data.countOrderStatus[0].value}</h4>
            <span className='text-sm font-medium'>Đơn hàng chờ xác nhận</span>
          </div>

          <span className='flex items-center gap-1 text-sm font-medium text-meta-3'>
            2.59%
            <svg
              className='fill-meta-3'
              width='10'
              height='11'
              viewBox='0 0 10 11'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M4.35716 2.47737L0.908974 5.82987L5.0443e-07 4.94612L5 0.0848689L10 4.94612L9.09103 5.82987L5.64284 2.47737L5.64284 10.0849L4.35716 10.0849L4.35716 2.47737Z'
                fill=''
              />
            </svg>
          </span>
        </div>
      </div>

      <Drawer
        title='Thống kê đơn hàng'
        open={isModalOpen}
        placement='right'
        width={1200}
        onClose={() => setIsModalOpen(!isModalOpen)}
      >
        <div className='grid grid-cols-4 gap-5 w-full'>
          {data &&
            data.countOrderStatus.map((orderStatus, index) => (
              <div
                key={uuid()}
                className='rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark'
              >
                <div className='flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4'>
                  <svg
                    className='fill-primary dark:fill-white'
                    width='20'
                    height='22'
                    viewBox='0 0 20 22'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M11.7531 16.4312C10.3781 16.4312 9.27808 17.5312 9.27808 18.9062C9.27808 20.2812 10.3781 21.3812 11.7531 21.3812C13.1281 21.3812 14.2281 20.2812 14.2281 18.9062C14.2281 17.5656 13.0937 16.4312 11.7531 16.4312ZM11.7531 19.8687C11.2375 19.8687 10.825 19.4562 10.825 18.9406C10.825 18.425 11.2375 18.0125 11.7531 18.0125C12.2687 18.0125 12.6812 18.425 12.6812 18.9406C12.6812 19.4219 12.2343 19.8687 11.7531 19.8687Z'
                      fill=''
                    />
                    <path
                      d='M5.22183 16.4312C3.84683 16.4312 2.74683 17.5312 2.74683 18.9062C2.74683 20.2812 3.84683 21.3812 5.22183 21.3812C6.59683 21.3812 7.69683 20.2812 7.69683 18.9062C7.69683 17.5656 6.56245 16.4312 5.22183 16.4312ZM5.22183 19.8687C4.7062 19.8687 4.2937 19.4562 4.2937 18.9406C4.2937 18.425 4.7062 18.0125 5.22183 18.0125C5.73745 18.0125 6.14995 18.425 6.14995 18.9406C6.14995 19.4219 5.73745 19.8687 5.22183 19.8687Z'
                      fill=''
                    />
                    <path
                      d='M19.0062 0.618744H17.15C16.325 0.618744 15.6031 1.23749 15.5 2.06249L14.95 6.01562H1.37185C1.0281 6.01562 0.684353 6.18749 0.443728 6.46249C0.237478 6.73749 0.134353 7.11562 0.237478 7.45937C0.237478 7.49374 0.237478 7.49374 0.237478 7.52812L2.36873 13.9562C2.50623 14.4375 2.9531 14.7812 3.46873 14.7812H12.9562C14.2281 14.7812 15.3281 13.8187 15.5 12.5469L16.9437 2.26874C16.9437 2.19999 17.0125 2.16562 17.0812 2.16562H18.9375C19.35 2.16562 19.7281 1.82187 19.7281 1.37499C19.7281 0.928119 19.4187 0.618744 19.0062 0.618744ZM14.0219 12.3062C13.9531 12.8219 13.5062 13.2 12.9906 13.2H3.7781L1.92185 7.56249H14.7094L14.0219 12.3062Z'
                      fill=''
                    />
                  </svg>
                </div>

                <div className='mt-4 flex items-end justify-between'>
                  <div className=''>
                    <h4 className='text-title-md font-bold text-black dark:text-white'>
                      {data.moneyOrderStatus[index].value.toLocaleString()} vnđ
                    </h4>
                    <span className='text-base font-medium'>
                      {orderStatus.value} đơn {renderOrderStatus(orderStatus.name).toLowerCase()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>

        <div className='w-full mt-6 h-full rounded-sm border grid gap-6 grid-cols-2 border-stroke bg-white pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5'>
          <div className='flex justify-between items-center'>
            <h3 className='text-xl font-semibold text-black dark:text-white mb-4'>Doanh thu hàng tuần trong tháng</h3>
            <Select
              defaultValue='0'
              style={{ width: 120 }}
              onChange={handleChange}
              options={[
                { value: '0', label: 'Tuần 1' },
                { value: '1', label: 'Tuần 2' },
                { value: '2', label: 'Tuần 3' },
                { value: '3', label: 'Tuần 4' }
              ]}
            />
          </div>
          <h3 className='text-xl font-semibold text-black dark:text-white mb-4 flex justify-between items-center'>
            Các đơn hàng cần xác nhận
            {hasSelected && (
              <Space>
                <Popconfirm
                  title='Bạn muốn xác nhận tất cả đơn hàng này?'
                  onConfirm={onConfirmOrderMany}
                  onCancel={() => setSelectedRowKeys([])}
                >
                  <Button styleClass='mb-4'>Xác nhận tất cả</Button>
                </Popconfirm>
              </Space>
            )}
          </h3>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart width={500} height={200} data={dataAhihih}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' />
              <YAxis />
              <Tooltip />
              <Legend />
              {index === 0 && (
                <Bar dataKey='tuần 1' fill='#8884d8' activeBar={<Rectangle fill='pink' stroke='blue' />} />
              )}
              {index === 1 && (
                <Bar dataKey='tuần 2' fill='#82ca9d' activeBar={<Rectangle fill='gold' stroke='purple' />} />
              )}
              {index === 2 && (
                <Bar dataKey='tuần 3' fill='#b4ae36' activeBar={<Rectangle fill='gold' stroke='purple' />} />
              )}
              {index === 3 && (
                <Bar dataKey='tuần 4' fill='#e333c2' activeBar={<Rectangle fill='gold' stroke='purple' />} />
              )}
            </BarChart>
          </ResponsiveContainer>
          <div className='h-full overflow-y-scroll'>
            <Table
              columns={columns}
              expandable={{
                expandedRowRender: TableChildrend
              }}
              dataSource={ordersData}
              pagination={{
                pageSize: pendingOrder && pendingOrder.limit,
                showSizeChanger: true,
                pageSizeOptions: ['10', '15', '20', '25'],
                total: pendingOrder && pendingOrder?.totalDocs,
                onChange(page, pageSize) {
                  setoptions((prev) => ({ ...prev, page, limit: pageSize }))
                }
              }}
              scroll={{ y: '50vh', x: 1000 }}
              bordered
              rowSelection={rowSelection}
            />
          </div>
        </div>

        <div className='w-full mt-6 h-full rounded-sm border grid grid-cols-1 border-stroke bg-white pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5'>
          <div className='flex justify-between items-center'>
            <h3 className='text-xl font-semibold text-black dark:text-white mb-4'>Doanh thu hàng tháng</h3>
            <Select
              defaultValue='pending'
              style={{ width: 220 }}
              onChange={handleChangeAnalyticMonth}
              options={[
                { value: 'pending', label: 'Chờ xác nhận' },
                { value: 'confirmed', label: 'Xác nhận đơn hàng' },
                { value: 'done', label: 'Hoàn thành đơn hàng' },
                { value: 'canceled', label: 'Hủy đơn hàng' }
              ]}
            />
          </div>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart
              width={500}
              height={300}
              data={dataAnalyticMonth}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5
              }}
            >
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey='Doanh thu' fill='#8884d8' activeBar={<Rectangle fill='pink' stroke='blue' />} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Drawer>
    </>
  )
}

export default CardThree
