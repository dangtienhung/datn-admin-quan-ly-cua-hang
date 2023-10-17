import { Popconfirm, Space, Table, message } from 'antd'
import { useState } from 'react'
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
    console.log('🚀 ~ file: ListVoucher.tsx:19 ~ handleDelete ~ id:', id)
    try {
      await deleteVoucher(id).then(() => {
        message.success('Xoá thành công!')
      })
    } catch (error) {
      message.error('Xoá thất bại!')
    }
  }
  const handleDeleteMany =  async () => {
    await pause(700)
    selectedRowKeys.forEach((selectedItem) => {
      deleteVoucher(selectedItem)
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
  if (isLoading) return <Loading />
  if (isError) return <NotFound />
  const columns = [
    {
      title: 'Mã giảm giá',
      dataIndex: 'code',
      key: 'code',
      render: (name: string) => <span className='uppercase'>{name}</span>
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
      render: (sale: number) => `${formatCurrency(sale)}`
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
            // onCancel={cancelDelete}
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
  const vouchers = voucherData?.data?.docs?.map((voucher) => ({
    ...voucher,
    key: voucher._id
  }))
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
