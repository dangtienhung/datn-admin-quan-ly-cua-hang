import { Drawer, Form, Input, InputNumber, Select } from 'antd'
import { useAppDispatch } from '~/store/store'
import { setOpenDrawer, setToppingId } from '~/store/slices'
// import { useEffect, useState } from 'react'

import { Button } from '~/components'
// import toast from 'react-hot-toast'
// import { useAppSelector } from '~/store/hooks'
// import { values } from 'lodash'

type FormUserProps = {
  open: boolean
}

export const FormUser = ({ open }: FormUserProps) => {
  const dispatch = useAppDispatch()
  const [form] = Form.useForm()

  const onFinish = async (values: any) => {
    console.log(values)
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
          name='name'
          rules={[{ required: true, message: 'Không được bỏ trống tên người dùng!' }]}
        >
          <Input size='large' placeholder='Tên người dùng' />
        </Form.Item>
        <Form.Item
          className='dark:text-white'
          label='Quyền'
          name='role'
          rules={[{ required: true, message: 'Không được bỏ trống quyền người dùng!' }]}
        >
          <Select
            size='large'
            className='w-full'
            // defaultValue='lucy'
            placeholder='Chức vụ'
            // style={{ width: 120 }}
            // onChange={handleChange}
            options={[
              { value: 'jack', label: 'Jack' },
              { value: 'lucy', label: 'Lucy' },
              { value: 'Yiminghe', label: 'yiminghe' },
              { value: 'disabled', label: 'Disabled', disabled: true }
            ]}
          />
        </Form.Item>

        <Form.Item
          className='dark:text-white'
          label='Giá topping'
          name='price'
          rules={[{ required: true, message: 'Không được bỏ trống giá toppping!' }]}
        >
          <InputNumber size='large' placeholder='Giá topping' className='w-full' />
        </Form.Item>

        <Form.Item>
          <Button styleClass='!w-full mt-5 py-2' type='submit'>
            Thêm topping
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  )
}
