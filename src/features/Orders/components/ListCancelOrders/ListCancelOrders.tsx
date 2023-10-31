import Loading from '~/components/Loading/Loading'
import { Space, Table, Button as ButtonAnt, Input, Tooltip } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { NotFound } from '~/pages'
import { useState, useRef, useEffect, useMemo } from 'react'
import { useGetAllOrderCancelQuery } from '~/store/services/Orders'
import { formatDate } from '~/utils/formatDate'
import { EyeFilled, SearchOutlined } from '@ant-design/icons'
import UserInfoRow from '../UserInfoRow/UserInfoRow'
import { RootState, useAppDispatch } from '~/store/store'
import { setOpenDrawer } from '~/store/slices'
import { setOrderData } from '~/store/slices/Orders/order.slice'
import type { InputRef } from 'antd'
import type { FilterConfirmProps } from 'antd/es/table/interface'
import { IOrderDataType } from '~/types'
import { ColumnType } from 'antd/lib/table'
import Highlighter from 'react-highlight-words'
import { useAppSelector } from '~/store/hooks'
import { ClientSocket } from '~/socket'

type DataIndex = keyof IOrderDataType
const ListCancelOrders = () => {
  const dispatch = useAppDispatch()
  const [cancelOrder, setCancelOrder] = useState<any>()
  const { orderDate } = useAppSelector((state) => state.orders)
  const { user } = useAppSelector((state: RootState) => state.persistedReducer.auth)

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

  const { isError, isLoading } = useGetAllOrderCancelQuery(options)

  useEffect(() => {
    ClientSocket.getCancelOrder(setCancelOrder, options)
    console.log(options)
  }, [orderDate, memoOptions, options])

  /*Search */
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef<InputRef>(null)

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  }

  const handleReset = (clearFilters: () => void) => {
    clearFilters()
    setSearchText('')
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
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      )
  })
  /*End Search */

  const columns: ColumnsType<any> = [
    {
      title: '#',
      dataIndex: 'index',
      width: 50,
      defaultSortOrder: 'ascend',
      sorter: (a, b) => a.index - b.index
    },
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderCode',
      width: 250,
      ...getColumnSearchProps('orderCode')
    },
    {
      title: 'Thông tin người đặt',
      dataIndex: 'user',
      key: 'user',
      width: 200,
      // rowScope: 'row',
      sorter: (a, b) => {
        return a.user.username.localeCompare(b.user.username)
      },
      render: (user: any) => <UserInfoRow user={user} />
    },
    // {
    //   title: 'Ghi chú',
    //   dataIndex: 'note',
    //   key: 'note'
    //   // render: (name: string) => <span className='capitalize'>{name}</span>
    // },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 200,
      render: (status: string) => (
        <span className={`text-white capitalize font-semibold bg-meta-1 rounded inline-block px-2 py-1`}>{status}</span>
      )
    },
    {
      title: 'Thời gian đặt hàng',
      dataIndex: 'timeOrder',
      key: 'timeOrder',
      width: 200,
      sorter: (a, b) => a.timeOrder.localeCompare(b.timeOrder),
      sortDirections: ['descend', 'ascend'],
      render: (time: string) => <span className='capitalize'>{formatDate(time)}</span>
    },

    {
      title: <span className='block text-center'>Action</span>,
      key: 'action',
      // fixed: 'right',
      width: 100,
      render: (_: any, order) => (
        <div className='flex items-center justify-center'>
          <Space size='middle'>
            <Tooltip title='Xem chi tiết đơn hàng'>
              <ButtonAnt
                size='large'
                className='bg-meta-5 hover:!text-white flex items-center justify-center text-white'
                icon={<EyeFilled />}
                onClick={() => {
                  // dispatch(setCategory({ _id: category._id, name: category.name }))
                  dispatch(setOpenDrawer(true))
                  dispatch(setOrderData({ ...order }))
                }}
              />
            </Tooltip>
          </Space>
        </div>
      )
    }
  ]
  const ordersData = cancelOrder?.docs.map((item: any, index: number) => ({
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
    reasonCancelOrder: item?.reasonCancelOrder ? item.reasonCancelOrder : '',
    orderCode: item._id.toUpperCase()
  }))
  if (isLoading) return <Loading />
  if (isError) return <NotFound />
  return (
    <div className='dark:bg-graydark'>
      <Table
        columns={columns}
        dataSource={ordersData}
        pagination={{
          pageSize: cancelOrder && cancelOrder.limit,
          showSizeChanger: true,
          pageSizeOptions: ['10', '15', '20', '25'],
          total: cancelOrder && cancelOrder?.totalDocs,
          onChange(page, pageSize) {
            setoptions((prev) => ({ ...prev, page, limit: pageSize }))
          }
        }}
        scroll={{ y: '50vh', x: 1000 }}
        bordered
      />
    </div>
  )
}

export default ListCancelOrders
