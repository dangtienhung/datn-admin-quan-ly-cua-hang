import Loading from '~/components/Loading/Loading'
import { NotFound } from '~/pages'
import {
  useDeleteImageSliderMutation,
  useDeleteSliderMutation,
  useGetAllSlidersQuery,
  useUpdateStatusMutation
} from '~/store/services'
import { BsFillTrashFill } from 'react-icons/bs'
import { Image, Popconfirm, Space, Table, Switch, Button as ButtonAnt, Tooltip } from 'antd'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { Button } from '~/components'
import { cancelDelete } from '~/features/Toppings'
import { messageAlert } from '~/utils/messageAlert'
import { pause } from '~/utils/pause'
import { useState } from 'react'
import { ISLider } from '~/types'

export const ListSliders = () => {
  const { data: sliders, isLoading, isError } = useGetAllSlidersQuery()
  const [deleteSlider] = useDeleteSliderMutation()
  const [deleteImageSlider] = useDeleteImageSliderMutation()
  const [updateStatus] = useUpdateStatusMutation()
  const onHandleDelete = async (id: string) => {
    await pause(2000)
    deleteSlider(id)
      .unwrap()
      .then(({ banner }: any) => {
        deleteImageSlider(banner.publicId)
        messageAlert('Xóa thành công', 'success')
      })
      .catch(() => messageAlert('Xóa thất bại!', 'error'))
  }

  const onSwitchChange = (id: number | string) => {
    updateStatus(id)
      .unwrap()
      .then(() => {
        messageAlert('Cập nhật thành công', 'success')
      })
      .catch(() => messageAlert('Cập nhật thất bại', 'error'))
  }

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const onHandleDeleteMany = () => {
    selectedRowKeys.forEach((selectItem) => {
      deleteSlider(selectItem as string)
        .unwrap()
        .then(({ banner }: any) => {
          deleteImageSlider(banner.publicId)
          messageAlert('Xóa thành công', 'success')
        })
        .catch(() => messageAlert('Xóa thất bại!', 'error'))
    })
    setSelectedRowKeys([])
  }
  // console.log(idSlider)
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  }
  const hasSelected = selectedRowKeys.length > 1
  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      width: 50
    },
    {
      title: 'Ảnh',
      dataIndex: 'url',
      key: 'url',
      render: (img: string) => <Image src={img} width={300} />
    },
    {
      title: 'Hiển thị',
      key: 'show',
      width: 200,
      render: (_: any, slider: ISLider) => (
        <Tooltip title='Thay đổi trang thái'>
          <Switch
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            onChange={() => onSwitchChange(slider._id)}
            defaultChecked={slider.is_active}
            disabled={countActive && countActive.length <= 1 && slider.is_active}
          />
        </Tooltip>
      )
    },
    {
      title: <span className='block text-center'>Action</span>,
      key: 'action',
      width: 200,
      render: (_: any, slider: ISLider) => (
        <div className='flex items-center justify-center'>
          <Space size='middle'>
            <Tooltip title='Xóa slide này'>
              <Popconfirm
                title='Bạn có muốn xóa slide này?'
                description='Bạn chắc chắn muốn xóa đi slide này?'
                okButtonProps={{ style: { backgroundColor: '#3C50E0', color: '#fff' } }}
                onCancel={cancelDelete}
                onConfirm={() => onHandleDelete(slider._id)}
              >
                <ButtonAnt
                  size='large'
                  className='bg-meta-1 hover:!text-white flex items-center justify-center text-white'
                  disabled={(slider.is_active && countActive && countActive.length <= 1) || slider.is_active}
                  icon={<BsFillTrashFill />}
                />
              </Popconfirm>
            </Tooltip>
          </Space>
        </div>
      )
    }
  ]
  const sliderData = sliders?.banners?.map((item, index) => ({
    ...item,
    key: item._id,
    index: index + 1
  }))
  const countActive = sliderData?.filter((item) => {
    return item.is_active === true
  })

  if (isLoading) return <Loading />
  if (isError) return <NotFound />
  return (
    <div>
      {hasSelected && (
        <Space>
          <Popconfirm
            title='Bạn thực sự muốn xóa những danh mục này?'
            description='Hành động này sẽ xóa những danh mục đang được chọn!'
            onConfirm={onHandleDeleteMany}
          >
            <Button variant='danger' styleClass='mb-4'>
              Xóa tất cả
            </Button>
          </Popconfirm>
        </Space>
      )}

      <Table
        className='dark:bg-graydark'
        columns={columns}
        dataSource={sliderData}
        bordered
        pagination={{
          pageSize: 10
          // total: sizeList?.totalDocs,
          // onChange(page) {
          //   setCurrentPage(page)
          // }
        }}
        scroll={{ y: '50vh' }}
        rowSelection={rowSelection}
      />
    </div>
  )
}
