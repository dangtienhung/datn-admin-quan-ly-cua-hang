import { Button as ButtonAntd, Table, Tooltip, message } from 'antd'

import { HiDocumentDownload } from 'react-icons/hi'
import { IRoleUser } from '~/types'
import { RootState } from '~/store/store'
import { exportDataToExcel } from '~/utils'
import { useAppSelector } from '~/store/hooks'
import { useGetAllProductActiveFalseQuery } from '~/store/services'
import { useRender } from '../../hooks'
import { useState } from 'react'

export const ProductListInActive = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [loading, setLoading] = useState(false)

  const { user } = useAppSelector((state: RootState) => state.persistedReducer.auth)

  const { data } = useGetAllProductActiveFalseQuery({
    _page: 1,
    _limit: 10,
    query: ''
  })

  const products = data?.docs.map((product: any, index: number) => ({
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

  const columnsData = useRender(data?.docs || [])

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
          icon={<HiDocumentDownload />}
          size='large'
          className='bg-[#209E62] text-white hover:!text-white text-sm font-semibold capitalize flex items-center'
          onClick={() => {
            if (data?.docs?.length === 0) {
              message.warning('Không có sản phẩm nào để xuất')
              return
            }
            exportDataToExcel(data?.docs, 'products-in-active')
          }}
        >
          Xuất excel
        </ButtonAntd>
      </div>
      <Table
        rowSelection={user.role === IRoleUser.ADMIN ? rowSelection : undefined}
        columns={columnsData}
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
