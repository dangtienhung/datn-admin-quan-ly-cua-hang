import { LoadingOutlined } from '@ant-design/icons'
import { Drawer, Form, Input, InputNumber } from 'antd'
import { Button } from '~/components'
import { useAppSelector } from '~/store/hooks'
import { useAddVoucherMutation, useUpdateVoucherMutation } from '~/store/services'
import { setOpenDrawer, setVoucher } from '~/store/slices'
import { RootState, useAppDispatch } from '~/store/store'
import { IVoucher } from '~/types'
import { messageAlert } from '~/utils/messageAlert'

interface VoucherAddProps {
  open: boolean
}

const VoucherAdd = ({ open }: VoucherAddProps) => {
  const dispatch = useAppDispatch()
  const [form] = Form.useForm()
  const [addVoucher, { isLoading: isAdding }] = useAddVoucherMutation()
  const [updateVoucher] = useUpdateVoucherMutation()
  const { voucherData } = useAppSelector((state: RootState) => state.vouchers)

  // const { TextArea } = Input
  // console.log(voucherData)
  voucherData._id &&
    form.setFieldsValue({
      code: voucherData.code,
      sale: voucherData.sale,
      discount: voucherData.discount
    })
  const onFinish = async (value: IVoucher) => {
    if (voucherData._id) {
      updateVoucher({ _id: voucherData._id, ...value })
        .unwrap()
        .then(() => {
          messageAlert('Cập nhật thành công', 'success')
          onClose()
        })
        .catch(() => messageAlert('Cập nhật thất bại', 'error'))
      return
      console.log('update', { ...value, _id: voucherData._id })
    }

    addVoucher(value)
      .unwrap()
      .then(() => {
        messageAlert('Thêm voucher thành công', 'success')
        onClose()
      })
      .catch(() => messageAlert('Thêm voucher thất bại!', 'error'))
  }
  const onClose = () => {
    dispatch(setOpenDrawer(false))
    dispatch(setVoucher({ _id: '', code: '', discount: 0, sale: 0 }))
    form.resetFields()
  }

  return (
    <Drawer
      title={voucherData._id ? 'Cập nhật voucher' : 'Thêm voucher mới'}
      width={476}
      destroyOnClose
      onClose={onClose}
      getContainer={false}
      open={open}
    >
      <Form
        name='basic'
        autoComplete='off'
        layout='vertical'
        form={form}
        className='dark:text-white'
        onFinish={onFinish}
      >
        <Form.Item
          className='dark:text-white'
          label='Tên voucher'
          name='code'
          rules={[{ required: true, message: 'Không được bỏ trống tên voucher!' }]}
        >
          <Input size='large' placeholder='Tên voucher' />
        </Form.Item>
        <Form.Item
          className='dark:text-white'
          label='Số lượng'
          name='discount'
          rules={[
            { required: true, message: 'Không được bỏ trống!' },
            {
              validator: (_, value) => {
                if (value < 0) {
                  return Promise.reject('Số lượng không được âm!')
                }
                return Promise.resolve()
              }
            }
          ]}
        >
          <Input size='large' placeholder='Số lượng voucher' />
        </Form.Item>
        <Form.Item
          className='dark:text-white'
          label='Giảm giá voucher'
          name='sale'
          rules={[
            { required: true, message: 'Không được bỏ trống!' },
            {
              validator: (_, value) => {
                if (value < 1000) {
                  return Promise.reject('Giảm giá không được nhỏ hơn 1000đ!')
                }
                return Promise.resolve()
              }
            }
          ]}
        >
          <InputNumber size='large' placeholder='Giảm giá voucher voucher(vnd)' className='w-full' />
        </Form.Item>
        {/* <Form.Item
          className='dark:text-white'
          label='Giảm giá từ '
          name='sale'
          rules={[{ required: true, message: 'Không được bỏ trống!' }]}
        >
          <Input size='large' placeholder='Giảm giá cho đơn từ ' />
        </Form.Item>
        <Form.Item
          className='dark:text-white'
          label='Mô tả voucher'
          name='desc'
          rules={[{ required: true, message: 'Không được bỏ trống!' }]}
        >
          <TextArea rows={4} placeholder='Mô tả voucher' />
        </Form.Item> */}
        <Form.Item>
          <Button
            disabled={isAdding ? true : false}
            icon={isAdding && <LoadingOutlined />}
            styleClass='!w-full mt-5 py-2'
            type='submit'
          >
            {voucherData._id ? 'Cập nhật voucher' : 'Thêm voucher mới'}
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  )
}

export default VoucherAdd
