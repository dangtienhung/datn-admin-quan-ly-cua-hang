import { Drawer, Form, Input, message } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { RootState, useAppDispatch } from '~/store/store'
import { setCategory, setOpenDrawer } from '~/store/slices'
import { Button } from '~/components'
import { useAppSelector } from '~/store/hooks'
import { useAddCategoryMutation, useUpdateCategoryMutation } from '~/store/services'

type FormCategoryProps = {
  open: boolean
}

const FormCategory = ({ open }: FormCategoryProps) => {
  const dispatch = useAppDispatch()
  const [form] = Form.useForm()
  const [addCategory, { isLoading: isAdding }] = useAddCategoryMutation()
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation()
  const { cateData } = useAppSelector((state: RootState) => state.categories)

  cateData._id &&
    form.setFieldsValue({
      name: cateData.name
    })
  const onFinish = async (values: { name: string }) => {
    if (cateData._id) {
      updateCategory({ _id: cateData._id, ...values })
        .unwrap()
        .then(() => {
          message.success('Cập nhật danh mục thành công')
          dispatch(setOpenDrawer(false))
          form.resetFields()
        })
        .catch(() => message.error('Cập nhật danh mục thất bại'))
      return
    }
    addCategory(values)
      .unwrap()
      .then(() => {
        message.success('Thêm danh mục thành công')
        dispatch(setOpenDrawer(false))
        form.resetFields()
      })
      .catch(() => message.error('Thêm danh mục thất bại'))
  }
  return (
    <Drawer
      title={cateData._id ? 'Cập nhật danh mục' : 'Thêm danh mục mới'}
      width={376}
      destroyOnClose
      onClose={() => {
        dispatch(setOpenDrawer(false))
        dispatch(setCategory({ _id: '', name: '' }))
        form.resetFields()
      }}
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
          label='Tên danh mục'
          name='name'
          rules={[{ required: true, message: 'Không được bỏ trống tên danh mục!' }]}
        >
          <Input size='large' placeholder='Tên danh mục' />
        </Form.Item>

        <Form.Item>
          <Button
            disabled={isAdding || isUpdating ? true : false}
            icon={isAdding || (isUpdating && <LoadingOutlined />)}
            styleClass='!w-full mt-5 py-2'
            type='submit'
          >
            {cateData._id ? 'Cập nhật danh mục' : 'Thêm danh mục'}
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  )
}

export default FormCategory
