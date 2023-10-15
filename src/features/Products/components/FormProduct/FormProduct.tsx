import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space } from 'antd'
import { setOpenDrawer, setProductId } from '~/store/slices'

import { PlusOutlined } from '@ant-design/icons'
import { useAppDispatch } from '~/store/store'
import { useAppSelector } from '~/store/hooks'

const { Option } = Select

interface FormProductProps {
  open: boolean
}

const FormProduct = ({ open }: FormProductProps) => {
  const dispatch = useAppDispatch()
  const { productId } = useAppSelector((state) => state.products)

  return (
    <Drawer
      title={`${productId === null ? 'Thêm' : 'Cập nhật'} sản phẩm`}
      placement='right'
      width={800}
      onClose={() => {
        dispatch(setOpenDrawer(false))
        dispatch(setProductId(null))
      }}
      open={open}
      extra={
        <Space>
          <label
            htmlFor='button-submit-form'
            onClick={() => {}}
            className='inline-block cursor-pointer py-2 px-6 rounded-lg bg-primary text-white'
          >
            Thêm sản phẩm
          </label>
        </Space>
      }
    >
      <Form layout='vertical' autoComplete='off'>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name='name' label='Name' rules={[{ required: true, message: 'Please enter user name' }]}>
              <Input placeholder='Please enter user name' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name='url' label='Url' rules={[{ required: true, message: 'Please enter url' }]}>
              <Input style={{ width: '100%' }} addonBefore='http://' addonAfter='.com' placeholder='Please enter url' />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name='owner' label='Owner' rules={[{ required: true, message: 'Please select an owner' }]}>
              <Select placeholder='Please select an owner'>
                <Option value='xiao'>Xiaoxiao Fu</Option>
                <Option value='mao'>Maomao Zhou</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name='type' label='Type' rules={[{ required: true, message: 'Please choose the type' }]}>
              <Select placeholder='Please choose the type'>
                <Option value='private'>Private</Option>
                <Option value='public'>Public</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name='approver'
              label='Approver'
              rules={[{ required: true, message: 'Please choose the approver' }]}
            >
              <Select placeholder='Please choose the approver'>
                <Option value='jack'>Jack Ma</Option>
                <Option value='tom'>Tom Liu</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name='dateTime'
              label='DateTime'
              rules={[{ required: true, message: 'Please choose the dateTime' }]}
            >
              <DatePicker.RangePicker
                style={{ width: '100%' }}
                getPopupContainer={(trigger) => trigger.parentElement!}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name='description'
              label='Description'
              rules={[
                {
                  required: true,
                  message: 'please enter url description'
                }
              ]}
            >
              <Input.TextArea rows={4} placeholder='please enter url description' />
            </Form.Item>
          </Col>
        </Row>

        <input type='submit' id='button-submit-form' value={'gửi'} className='hidden' />
      </Form>
    </Drawer>
  )
}

export default FormProduct
