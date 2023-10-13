import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { Drawer, Form, Input, Modal, Upload } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { RcFile } from 'antd/es/upload'
import { UploadFile, UploadProps } from 'antd/lib'
import { useState } from 'react'
import { Button } from '~/components'
import { useAppSelector } from '~/store/hooks'
import { useAddBlogMutation, useUpdateBlogMutation } from '~/store/services'
import { setBlog, setOpenDrawer } from '~/store/slices'
import { RootState, useAppDispatch } from '~/store/store'
import { IBlogs } from '~/types'
import { messageAlert } from '~/utils/messageAlert'

interface BlogFormProps {
  open: boolean
}

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })

const FormBlog = ({ open }: BlogFormProps) => {
  const dispatch = useAppDispatch()
  const [form] = Form.useForm()
  const { blogData } = useAppSelector((state: RootState) => state.blogs)
  const [addBlog, { isLoading: isAdding }] = useAddBlogMutation()
  const [updateBlog] = useUpdateBlogMutation()

  const [fileList, setFileList] = useState<UploadFile[]>([])
  const secureUrls = fileList?.map((file) => file.response?.secure_url)
  console.log(secureUrls)

  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')
  const handleCancel = () => setPreviewOpen(false)
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile)
    }

    setPreviewImage(file.url || (file.preview as string))
    setPreviewOpen(true)
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1))
  }
  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => setFileList(newFileList)
  // console.log(blogData)

  blogData._id &&
    form.setFieldsValue({
      name: blogData.name,
      description: blogData.description,
      images: blogData.images[0]?.url
    })

  const onFinish = async (value: IBlogs) => {
    if (blogData._id) {
      updateBlog({ ...value, _id: blogData._id, images: blogData.images })
        .unwrap()
        .then(() => {
          messageAlert('Cập nhật thành công', 'success')
          onClose()
        })
        .catch(() => messageAlert('Cập nhật thất bại', 'error'))
      return
      console.log('update:', { ...value, _id: blogData._id })
    }
    if (secureUrls) {
      addBlog({ ...value, images: { url: `${secureUrls}` } })
        .unwrap()
        .then(() => {
          messageAlert('Thêm bài viết thành công', 'success')
          onClose()
        })
        .catch(() => messageAlert('Thêm bài viết thất bại!', 'error'))
      // console.log('value add:', {...value , images: {url: secureUrls}})
    }
  }
  const onClose = () => {
    dispatch(setOpenDrawer(false))
    dispatch(setBlog({ _id: '', name: '', description: '', images: [] }))
    form.resetFields()
  }
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  )
  return (
    <Drawer
      title={blogData?._id ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới'}
      width={576}
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
          label='Ảnh bài viết'
          name='images'
          rules={[{ required: true, message: 'Không được bỏ trống!' }]}
        >
          {blogData._id ? (
            <img src={blogData.images[0]?.url} alt={blogData.images[0]?.filename} className='w-full' />
          ) : (
            <>
              <Upload
                action='https://api.cloudinary.com/v1_1/dx4a0htyu/image/upload'
                listType='picture-card'
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                data={{
                  upload_preset: 'uploadImg'
                }}
              >
                {fileList.length >= 1 ? null : uploadButton}
              </Upload>
            </>
          )}
        </Form.Item>
        <Form.Item
          className='dark:text-white'
          label='Tên blog'
          name='name'
          rules={[{ required: true, message: 'Không được bỏ trống tên bài viết!' }]}
        >
          <Input size='large' placeholder='Tên bài viết' />
        </Form.Item>
        <Form.Item
          className='dark:text-white'
          label='Mô tả bài viết'
          name='description'
          rules={[{ required: true, message: 'Không được bỏ trống!' }]}
        >
          <TextArea rows={5} size='large' placeholder='Mô tả bài viết' className='w-full' />
        </Form.Item>
        <Form.Item>
          <Button
            disabled={isAdding ? true : false}
            icon={isAdding && <LoadingOutlined />}
            styleClass='!w-full mt-5 py-2'
            type='submit'
          >
            {blogData._id ? 'Cập nhật bài viết' : 'Thêm bài viết mới'}
          </Button>
        </Form.Item>
      </Form>
      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img alt='example' style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </Drawer>
  )
}
export default FormBlog
