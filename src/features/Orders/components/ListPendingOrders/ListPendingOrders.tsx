import Loading from '~/components/Loading/Loading'
import { Popconfirm, Space, Table, Button as ButtonAnt, Input } from 'antd'
import { Button } from '~/components'
import { ColumnsType } from 'antd/es/table'
import { NotFound } from '~/pages'
import { useRef, useState } from 'react'
import { useConfirmOrderMutation, useGetAllOrderPendingQuery } from '~/store/services/Orders'
import { formatDate } from '~/utils/formatDate'
import { EyeFilled, CloseCircleFilled, CheckOutlined, SearchOutlined } from '@ant-design/icons'
import UserInfoRow from '../UserInfoRow/UserInfoRow'
import { useAppDispatch } from '~/store/store'
import { setOpenDrawer } from '~/store/slices'
import { setIdOrderCancel, setOrderData } from '~/store/slices/Orders/order.slice'
import { messageAlert } from '~/utils/messageAlert'
import { setOpenModal } from '~/store/slices/Modal'
import type { InputRef } from 'antd'
import type { FilterConfirmProps } from 'antd/es/table/interface'
import { IOrderDataType } from '~/types'
import { ColumnType } from 'antd/lib/table'
import Highlighter from 'react-highlight-words'

type DataIndex = keyof IOrderDataType
const ListPendingOrders = () => {
  const dispatch = useAppDispatch()
  const [options, setoptions] = useState({
    page: 1,
    limit: 10
  })

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

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [confirmOrder] = useConfirmOrderMutation()
  const onConfirmOrder = (id: string) => {
    confirmOrder(id)
      .unwrap()
      .then(() => {
        messageAlert('Thay đổi trạng thái thành công', 'success', 4)
      })
      .catch(() => messageAlert('Thay đổi trạng thái thất bại', 'error'))
  }

  const onConfirmOrderMany = () => {
    selectedRowKeys.forEach((selectItem) => {
      confirmOrder(selectItem as string)
        .unwrap()
        .then(() => {
          messageAlert('Thay đổi trạng thái thành công', 'success', 4)
        })
        .catch(() => messageAlert('Thay đổi trạng thái thất bại', 'error'))
    })
    setSelectedRowKeys([])
  }
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  }
  const hasSelected = selectedRowKeys.length > 1

  const { data: orders, isLoading, isError } = useGetAllOrderPendingQuery(options)
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
      key: 'orderCode',
      width: 250,
      ...getColumnSearchProps('orderCode')
    },
    {
      title: 'Thông tin người đặt',
      dataIndex: 'user',
      key: 'user',
      rowScope: 'row',
      sorter: (a, b) => {
        return a.user.username.localeCompare(b.user.username)
      },
      sortDirections: ['descend', 'ascend'],
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
      width: 100,
      render: (status: string) => (
        <span
          className={`text-white capitalize font-semibold bg-meta-6
          rounded inline-block px-2 py-1`}
        >
          {status}
        </span>
      )
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
      // width: 300,
      render: (_: any, order) => (
        <Space size='middle'>
          <Button
            variant='warning'
            icon={<EyeFilled />}
            onClick={() => {
              // dispatch(setCategory({ _id: category._id, name: category.name }))
              dispatch(setOpenDrawer(true))
              dispatch(setOrderData({ ...order }))
            }}
          />
          <Button icon={<CheckOutlined />} onClick={() => onConfirmOrder(order.key)} />

          <Button
            variant='danger'
            icon={<CloseCircleFilled />}
            onClick={() => {
              dispatch(setOpenModal(true))
              dispatch(setIdOrderCancel(order.key))
            }}
          />
        </Space>
      )
    }
  ]
  if (isLoading) return <Loading />
  if (isError) return <NotFound />

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
    orderCode: item._id.toUpperCase()
  }))

  return (
    <>
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
          scroll={{ y: '50vh', x: 1350 }}
          bordered
          rowSelection={rowSelection}
        />
      </div>
    </>
  )
}

export default ListPendingOrders
