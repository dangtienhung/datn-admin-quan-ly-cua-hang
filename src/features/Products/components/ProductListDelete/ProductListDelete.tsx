import { Button, DeleteIcon } from '~/components'
import { Button as ButtonAntd, Popconfirm, Space, Table, Tag, Tooltip, message } from 'antd'
import { IProduct, ISizeRefProduct, IToppingRefProduct } from '~/types'
import { useDeleteProductMutation, useGeAllProductDeletedTrueQuery, useRestoreProductMutation } from '~/store/services'

import { AiOutlineUndo } from 'react-icons/ai'
import { ICategoryRefProduct } from '~/types/Category'
import { TbBasketDiscount } from 'react-icons/tb'
import clsxm from '~/utils/clsxm'
import { formatCurrency } from '~/utils'
import { handleTogglePreviewProduct } from '../../utils'
import { useState } from 'react'

export const ProductListDelete = () => {
  /* lấy ra tất cả các sản phẩm bị xóa mềm */
  const { data: dataProductsDeleted } = useGeAllProductDeletedTrueQuery({
    _page: 1,
    _limit: 10,
    query: ''
  })
  const [restoreProduct] = useRestoreProductMutation()
  const [deleteProduct] = useDeleteProductMutation()

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [loading, setLoading] = useState(false)
  const [openPreProduct, setOpenPreProduct] = useState<boolean>(false)

  const products = dataProductsDeleted?.docs.map((product: any, index: number) => ({
    ...product,
    key: product._id,
    index: index + 1
  }))

  const start = () => {
    setLoading(true)
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([])
      setLoading(false)
    }, 1000)
  }

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys)
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  }
  const hasSelected = selectedRowKeys.length > 0

  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      width: 50
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      width: 350,
      render: (name: string, product: IProduct) => (
        <div className='gap-x-3 flex items-center justify-start'>
          <img
            src={product.images[0].url}
            alt={product.images[0].filename}
            className='object-cover w-20 h-20 rounded-lg cursor-pointer'
          />
          <div className='flex flex-col gap-0.5 justify-center items-start'>
            <Tag color={clsxm({ success: !product.is_deleted }, { '#333': product.is_deleted })}>
              {product.is_active && !product.is_deleted ? 'Đang hoạt động' : 'Không hoạt động'}
            </Tag>
            <p
              className='hover:underline capitalize truncate cursor-pointer w-[215px]'
              onClick={() => handleTogglePreviewProduct(openPreProduct, setOpenPreProduct)}
            >
              {name}
            </p>
            {product.sale > 0 && (
              <p className='flex items-center justify-center gap-1'>
                <span>
                  <TbBasketDiscount />
                </span>
                <span className=''>{formatCurrency(product.sale)}</span>
              </p>
            )}
          </div>
        </div>
      )
    },
    {
      title: 'Size sản phẩm',
      dataIndex: 'sizes',
      key: 'sizes',
      width: 200,
      render: (sizes: ISizeRefProduct[]) => (
        <>
          <div className='flex flex-col gap-1'>
            {sizes?.slice(0, 2).map((size: ISizeRefProduct) => (
              <div key={size._id} className='relative grid grid-cols-2'>
                <p className='border-r-graydark w-full pr-3 uppercase border-r border-opacity-50'>{size.name}</p>
                <p className='w-full pl-3'>{formatCurrency(size.price)}</p>
              </div>
            ))}
          </div>
          <p className=''>{sizes?.length > 2 && '....'}</p>
        </>
      )
    },
    {
      title: 'Topping sản phẩm',
      dataIndex: 'toppings',
      key: 'toppings',
      render: (toppings: IToppingRefProduct[]) => (
        <>
          <div className='flex flex-col gap-1'>
            {/* chỉ map 2 topping ra ngoài màn hình thôi */}
            {toppings.slice(0, 2).map((topping: IToppingRefProduct) => (
              <div key={topping._id} className='relative grid grid-cols-2'>
                <p className='border-r-graydark w-full pr-3 uppercase border-r border-opacity-50'>{topping.name}</p>
                <p className='w-full pl-3'>{formatCurrency(topping.price)}</p>
              </div>
            ))}
          </div>
          <p className=''>{toppings.length > 2 && '....'}</p>
        </>
      )
    },
    {
      title: 'Danh mục sản phẩm',
      dataIndex: 'category',
      key: 'category',
      render: (category: ICategoryRefProduct) => <p className='capitalize'>{category?.name || 'Không khả dụng'}</p>
    },
    {
      title: 'Action',
      dataIndex: 'action',
      width: 100,
      key: 'action',
      render: (_: any, product: IProduct) => (
        <Space>
          <Tooltip title='Khôi phục sản phẩm'>
            <Popconfirm
              title='Bạn có muốn khôi phục sản phẩm này?'
              onConfirm={() => handleRestoreProduct(product._id)}
              okText='Đồng ý'
              cancelText='Hủy'
            >
              <ButtonAntd
                icon={<AiOutlineUndo />}
                className='bg-primary hover:text-white flex items-center justify-center text-white'
              />
            </Popconfirm>
          </Tooltip>
          <Popconfirm
            title='Xóa sản phẩm?'
            onConfirm={() => handleDeleteProduct(product._id)}
            okText='Đồng ý'
            cancelText='Hủy'
          >
            <ButtonAntd
              icon={<DeleteIcon />}
              danger
              className='hover:text-white flex items-center justify-center text-white'
            />
          </Popconfirm>
        </Space>
      )
    }
  ]

  const handleRestoreProduct = async (id: string) => {
    try {
      const response = await restoreProduct({ id })
      if ((response as any).message === 'success') {
        message.success('Khôi phục sản phẩm thành công!')
      }
    } catch (error) {
      message.error('Khôi phục sản phẩm thất bại')
    }
  }

  const handleDeleteProduct = async (id: string) => {
    try {
      const response = await deleteProduct({ id })
      console.log('🚀 ~ file: ProductListDelete.tsx:183 ~ handleDeleteProduct ~ reponse:', response)
      if ((response as any).message === 'success') {
        message.success('Xóa sản phẩm thành công!')
      }
    } catch (error) {
      message.error('Khôi phục sản phẩm thất bại')
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }} className='flex items-center gap-3'>
        <Tooltip title={hasSelected ? `Đang chọn ${selectedRowKeys?.length} sản phẩm` : ''}>
          <ButtonAntd
            size='large'
            danger
            type='primary'
            className='text-sm font-semibold capitalize'
            onClick={start}
            disabled={!hasSelected}
            loading={loading}
          >
            Xóa tất cả
          </ButtonAntd>
        </Tooltip>
        <ButtonAntd size='large' className='bg-green text-green-d10 text-sm font-semibold capitalize'>
          Xuất excel
        </ButtonAntd>
        <ButtonAntd
          size='large'
          className='bg-red text-red-d10 hover:text-red-d10 hover:bg-red text-sm font-semibold capitalize'
        >
          Xuất PDF
        </ButtonAntd>
      </div>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={products}
        scroll={{ x: 1300 }}
        pagination={{
          pageSizeOptions: ['5', '10', '15', '20', '25', '30', '40', '50'],
          defaultPageSize: 5,
          showSizeChanger: true
        }}
      />
    </div>
  )
}
