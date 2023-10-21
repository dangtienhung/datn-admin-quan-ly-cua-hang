import { SearchOutlined } from '@ant-design/icons'
import { Input, InputRef, Popconfirm, Space, Table, message, Button as ButtonAnt } from 'antd'
import { FilterConfirmProps } from 'antd/es/table/interface'
import { ColumnType } from 'antd/lib/table'
import { useRef, useState } from 'react'
import Highlighter from 'react-highlight-words'
import { BsFillPencilFill, BsFillTrashFill } from 'react-icons/bs'
import { Button } from '~/components'
import Loading from '~/components/Loading/Loading'
import { NotFound } from '~/pages'
import { useDeleteVoucherMutation, useGetAllVouchersQuery } from '~/store/services'
import { setOpenDrawer, setVoucher } from '~/store/slices'
import { useAppDispatch } from '~/store/store'
import { IVoucher } from '~/types'
import { formatCurrency } from '~/utils'
import { messageAlert } from '~/utils/messageAlert'
import { pause } from '~/utils/pause'

const ListVoucher = () => {
  const dispatch = useAppDispatch()
  const [currentPage, setCurrentPage] = useState(1)
  const { data: voucherData, isLoading, isError } = useGetAllVouchersQuery(currentPage)
  const [deleteVoucher] = useDeleteVoucherMutation()

  console.log(voucherData)
  const handleDelete = async (id: string) => {
    // console.log('🚀 ~ file: ListVoucher.tsx:19 ~ handleDelete ~ id:', id)
    try {
      await deleteVoucher({ id }).then(() => {
        message.success('Xoá thành công!')
      })
    } catch (error) {
      message.error('Xoá thất bại!')
    }
  }
  const handleDeleteMany = async () => {
    await pause(700)
    selectedRowKeys.forEach((selectedItem) => {
      deleteVoucher({ id: selectedItem })
        .unwrap()
        .then(() => {
          messageAlert('Xóa thành công', 'success')
          setSelectedRowKeys([])
        })
    })
  }
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  const hasSelected = selectedRowKeys.length > 0
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys)
    setSelectedRowKeys(newSelectedRowKeys)
  }
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  }

  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef<InputRef>(null)

  const handleSearch = (selectedKeys: string[], confirm: (param?: FilterConfirmProps) => void, dataIndex: IVoucher) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(`${dataIndex}`)
  }

  const handleReset = (clearFilters: () => void) => {
    clearFilters()
    setSearchText('')
  }

  const getColumnSearchProps = (dataIndex: any): ColumnType<any> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Tìm kiếm mã`}
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
          >
            Search
          </ButtonAnt>
          <ButtonAnt onClick={() => clearFilters && handleReset(clearFilters)}>Reset</ButtonAnt>
          <ButtonAnt
            onClick={() => {
              close()
            }}
          >
            close
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

  if (isLoading) return <Loading />
  if (isError) return <NotFound />
  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      width: 50
    },
    {
      title: 'Mã giảm giá',
      dataIndex: 'code',
      key: 'code',
      render: (name: string) => <span className='uppercase'>{name}</span>,
      ...getColumnSearchProps('code')
    },
    {
      title: 'Số lượng mã',
      dataIndex: 'discount',
      key: 'discount',
      render: (discount: number) => `${discount}`
    },
    {
      title: 'Giảm giá',
      dataIndex: 'sale',
      key: 'sale',
      ...getColumnSearchProps('sale'),
      sorter: (x: { sale: number }, y: { sale: number }) => {
        const saleX = x.sale || 0
        const saleY = y.sale || 0
        return saleX - saleY
      },
      render: (sale: number) => `${formatCurrency(sale)}`
    },
    {
      title: 'Mã giảm giá',
      dataIndex: 'title',
      key: 'title',
      render: (name: string) => <span>{name}</span>,
      ...getColumnSearchProps('title')
    },
    {
      title: 'Action',
      key: 'action',
      width: 300,
      render: (_: any, voucher: IVoucher) => (
        <Space size='middle'>
          <Button
            icon={<BsFillPencilFill />}
            onClick={() => {
              dispatch(setVoucher(voucher))
              dispatch(setOpenDrawer(true))
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title='Bạn có muốn xóa voucher này?'
            description='Are you sure to delete this task?'
            okButtonProps={{ style: { backgroundColor: '#3C50E0', color: '#fff' } }}
            okText='Có'
            cancelText='Không'
            onConfirm={() => handleDelete(voucher._id!)}
          >
            <Button variant='danger' icon={<BsFillTrashFill />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]
  const vouchers = voucherData?.data?.docs?.map((voucher, index) => ({
    ...voucher,
    key: voucher._id,
    index: index + 1
  }))
  // console.log(vouchers)

  return (
    <div>
      <Space>
        <Popconfirm
          title='Bạn thực sự muốn xóa những mã này?'
          description='Hành động này sẽ xóa những mã đang được chọn!'
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
        dataSource={vouchers}
        pagination={{
          pageSize: voucherData && voucherData?.data?.limit,
          total: voucherData && voucherData?.data?.totalDocs,
          onChange(page) {
            setCurrentPage(page)
          }
        }}
        rowSelection={rowSelection}
        scroll={{ y: '60vh' }}
        bordered
      />
    </div>
  )
}

export default ListVoucher
