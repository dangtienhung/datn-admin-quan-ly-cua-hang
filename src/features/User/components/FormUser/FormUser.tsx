import { Drawer, Form, Input } from 'antd'
import { useAppDispatch } from '~/store/store'
import { setOpenDrawer, setToppingId } from '~/store/slices'
// import { useEffect, useState } from 'react'

import { Button } from '~/components'
import { useAddUserMutation } from '~/store/services/Users'
import toast from 'react-hot-toast'
// import { useAppSelector } from '~/store/hooks'

type FormUserProps = {
  open: boolean
}

export const FormUser = ({ open }: FormUserProps) => {
  const dispatch = useAppDispatch()
  const [form] = Form.useForm()
  const [addUser] = useAddUserMutation()

  const onFinish = async (values: any) => {
    console.log(values)
    // return
    try {
      await addUser(values).then(() => {
        toast.success('Thêm người dùng thành công')
        dispatch(setOpenDrawer(false))
      })
    } catch (error) {
      toast.error('Thêm người dùng thất bại!')
    }
  }
  return (
    <Drawer
      className='dark:!text-white dark:bg-black'
      title={'Thêm người dùng mới'}
      width={600}
      destroyOnClose
      onClose={() => {
        form.resetFields()
        dispatch(setOpenDrawer(false))
        dispatch(setToppingId(null))
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
          label='Tên người dùng'
          name='username'
          rules={[{ required: true, message: 'Không được bỏ trống tên người dùng!' }]}
        >
          <Input size='large' placeholder='Tên người dùng' />
        </Form.Item>
        <Form.Item
          className='dark:text-white'
          label='Tài khoản'
          name='account'
          rules={[
            { required: true, message: 'Không được bỏ trống tài khoản!' },
            { type: 'email', message: 'Email sai định dạng' }
          ]}
        >
          <Input type='email' size='large' placeholder='Tài khoản' />
        </Form.Item>
        <Form.Item
          className='dark:text-white'
          label='Mật khẩu'
          name='password'
          rules={[
            { required: true, message: 'Không được bỏ trống mật khẩu!' },
            {
              min: 6,
              message: 'Mật khẩu phải nhiều hơn 6 ký tự'
            }
          ]}
        >
          <Input.Password placeholder='Mật khẩu' size='large' />
        </Form.Item>

        <Form.Item
          className='dark:text-white'
          label='Địa chỉ'
          name='address'
          rules={[{ required: true, message: 'Không được bỏ trống giá địa chỉ!' }]}
        >
          <Input size='large' placeholder='Địa chỉ' className='w-full' />
        </Form.Item>

        <Form.Item>
          <Button styleClass='!w-full mt-5 py-2' type='submit'>
            Thêm người dùng
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  )
}
