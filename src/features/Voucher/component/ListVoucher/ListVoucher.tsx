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
  if (isLoading) return <Loading />
  if (isError) return <NotFound />
  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      with: '5%'
    },
    {
      title: 'CODE',
      dataIndex: 'code',
      key: 'code',
      render: (name: string) => <span className='uppercase'>{name}</span>
    },
    {
      title: 'DISCOUNT',
      dataIndex: 'discount',
      key: 'discount',
      render: (discount: number) => `${discount}%`
    },
    {
      title: 'SALE',
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
  const vouchers = voucherData?.data?.docs?.map((voucher, index) => ({
    ...voucher,
    key: voucher._id,
    index: index + 1
  }))
  return (
    <div className='dark:bg-graydark'>
      <Table
        columns={columns}
        dataSource={vouchers}
        pagination={{
          pageSize: voucherData && voucherData?.data?.limit,
          total: voucherData && voucherData?.data?.totalDocs,
          onChange(page) {
            setCurrentPage(page)
          }
        }}
      />
    </div>
  )
}

export default ListVoucher
