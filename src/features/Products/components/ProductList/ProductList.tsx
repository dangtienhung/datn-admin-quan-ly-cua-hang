import { Button as ButtonAntd, Input, InputRef, Popconfirm, Space, Table, Tag, Tooltip, message } from 'antd'
import { IProduct, ISizeRefProduct, IToppingRefProduct } from '~/types'
import { RootState, useAppDispatch } from '~/store/store'
import { exportDataToExcel, formatCurrency } from '~/utils'
import { setOpenDrawer, setProductDetail, setProductId } from '~/store/slices'
import { useRef, useState } from 'react'

import { AiFillEdit } from 'react-icons/ai'
import type { ColumnType } from 'antd/es/table'
import { DeleteIcon } from '~/components'
import { FaFilePdf } from 'react-icons/fa6'
import { FilterConfirmProps } from 'antd/es/table/interface'
import { HiDocumentDownload } from 'react-icons/hi'
import Highlighter from 'react-highlight-words'
import { ICategoryRefProduct } from '~/types/Category'
import { SearchOutlined } from '@ant-design/icons'
import { TbBasketDiscount } from 'react-icons/tb'
import clsxm from '~/utils/clsxm'
import { useAppSelector } from '~/store/hooks'
import { useDeleteFakeProductMutation } from '~/store/services'

const ProductList = () => {
  const dispatch = useAppDispatch()
  const { productsList } = useAppSelector((state: RootState) => state.products)
  const [deleteFakeProduct] = useDeleteFakeProductMutation()

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [loading, setLoading] = useState(false)

  const products = productsList.map((product: IProduct, index: number) => ({
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

  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef<InputRef>(null)

  const handleSearch = (selectedKeys: string[], confirm: (param?: FilterConfirmProps) => void, dataIndex: IProduct) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex.name)
  }

  const getColumnSearchProps = (dataIndex: IProduct): ColumnType<IProduct> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
      <div style={{ padding: 8, width: '100%' }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          size='large'
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <ButtonAntd
            type='primary'
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size='large'
          >
            Tìm kiếm sản phẩm
          </ButtonAntd>
        </Space>
      </div>
    ),
    filterIcon: () => (
      <Tooltip title='Tìm kiếm sản phẩm'>
        <ButtonAntd type='primary' shape='circle' icon={<SearchOutlined />} />
      </Tooltip>
    ),
    onFilter: (value: any, record: any) => {
      return record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
    },
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100)
      }
    },
    render: (text, product: IProduct) =>
      searchedColumn === dataIndex.name ? (
        <div className='flex items-center justify-start gap-x-3'>
          <img
            src={product.images[0].url}
            alt={product.images[0].filename}
            className='object-cover w-20 h-20 rounded-lg cursor-pointer'
            onClick={() => {
              dispatch(setOpenDrawer(true))
              dispatch(setProductDetail(product))
            }}
          />
          <div className='flex flex-col gap-0.5 justify-center items-start'>
            <Tag
              color={clsxm(
                { success: !product.is_deleted && product.is_active },
                { '#333': product.is_deleted },
                { red: !product.is_deleted && !product.is_active }
              )}
            >
              {product.is_active && !product.is_deleted ? 'Đang hoạt động' : 'Không hoạt động'}
            </Tag>
            <p
              className='hover:underline capitalize truncate cursor-pointer w-[215px]'
              onClick={() => {
                dispatch(setOpenDrawer(true))
                dispatch(setProductDetail(product))
              }}
            >
              {/* {product.name} */}
              <Highlighter
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text ? text.toString() : ''}
              />
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
      ) : (
        // text
        <div className='flex items-center justify-start gap-x-3'>
          <img
            src={product.images[0].url}
            alt={product.images[0].filename}
            className='object-cover w-20 h-20 rounded-lg cursor-pointer'
            onClick={() => {
              dispatch(setOpenDrawer(true))
              dispatch(setProductDetail(product))
            }}
          />
          <div className='flex flex-col gap-0.5 justify-center items-start'>
            <Tag
              color={clsxm(
                { success: !product.is_deleted && product.is_active },
                { '#333': product.is_deleted },
                { red: !product.is_deleted && !product.is_active }
              )}
            >
              {product.is_active && !product.is_deleted ? 'Đang hoạt động' : 'Không hoạt động'}
            </Tag>
            <p
              className='hover:underline capitalize truncate cursor-pointer w-[215px]'
              onClick={() => {
                dispatch(setOpenDrawer(true))
                dispatch(setProductDetail(product))
              }}
            >
              {product.name}
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
  })

  const columns: any = [
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
      ...getColumnSearchProps('name' as unknown as IProduct)
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
                <p className='w-full pr-3 uppercase border-r border-opacity-50 border-r-graydark'>{size.name}</p>
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
                <p className='w-full pr-3 uppercase border-r border-opacity-50 border-r-graydark'>{topping.name}</p>
                <p className='w-full pl-3'>{formatCurrency(topping.price)}</p>
              </div>
            ))}
          </div>
          <p className=''>{toppings?.length > 2 && '....'}</p>
        </>
      )
    },
    {
      title: 'Danh mục sản phẩm',
      dataIndex: 'category',
      key: 'category',
      render: (category: ICategoryRefProduct) => <p className='capitalize'>{category?.name || 'Không có thông tin'}</p>,
      filters: productsList.map((product: IProduct) => ({ text: product.category.name, value: product.category.name })),
      // filteredValue: filteredInfo. || null,
      onFilter: (value: string, record: IProduct) => record.category.name.includes(value),
      ellipsis: true
    },
    {
      title: 'Action',
      dataIndex: 'action',
      width: 100,
      key: 'action',
      render: (_: any, product: IProduct) => (
        <Space>
          <Tooltip title='Cập nhật sản phẩm'>
            <ButtonAntd
              icon={<AiFillEdit />}
              onClick={() => {
                dispatch(setOpenDrawer(true))
                dispatch(setProductId(product._id))
              }}
              className='flex items-center justify-center text-white bg-primary hover:text-white'
            />
          </Tooltip>
          <Popconfirm
            title='Xóa sản phẩm?'
            onConfirm={() => handleDeleteProduct(product._id)}
            okText='Có'
            cancelText='Không'
          >
            <ButtonAntd
              icon={<DeleteIcon />}
              danger
              className='flex items-center justify-center text-white hover:text-white'
            />
          </Popconfirm>
        </Space>
      )
    }
  ]

  /* handle delete product */
  const handleDeleteProduct = async (id: string) => {
    try {
      const response = await deleteFakeProduct({ id }).unwrap()
      if (response.message === 'success') {
        message.success('Sản phẩm đã được chuyển vào thùng rác!')
      }
    } catch (error) {
      message.error('Xóa sản phẩm thất bại')
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
        <ButtonAntd
          size='large'
          icon={<HiDocumentDownload />}
          className='bg-[#209E62] text-white hover:!text-white text-sm font-semibold capitalize flex items-center'
          onClick={() => {
            if (productsList?.length === 0) {
              message.warning('Không có sản phẩm nào để xuất')
              return
            }
            exportDataToExcel(productsList, 'products')
          }}
        >
          Xuất excel
        </ButtonAntd>
        <ButtonAntd
          icon={<FaFilePdf />}
          size='large'
          className='flex items-center text-sm font-semibold capitalize bg-red text-red-d10 hover:text-red-d10 hover:bg-red'
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

export default ProductList
