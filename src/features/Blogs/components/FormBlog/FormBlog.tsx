import { LoadingOutlined } from '@ant-design/icons'
import { Drawer, Form, Image, Input } from 'antd'
import { RcFile } from 'antd/es/upload'
import { useRef, useState } from 'react'
import { Button } from '~/components'
import { useAppSelector } from '~/store/hooks'
import { useAddBlogMutation, useUpLoadImageBlogMutation, useUpdateBlogMutation } from '~/store/services'
import { setBlog, setOpenDrawer } from '~/store/slices'
import { RootState, useAppDispatch } from '~/store/store'
import { IBlogs } from '~/types'
import { messageAlert } from '~/utils/messageAlert'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import UploadFile from '~/components/UploadFile'
import toast from 'react-hot-toast'
import { container, formats } from '../../utils/ReactQuill'
interface BlogFormProps {
  open: boolean
}
const FormBlog = ({ open }: BlogFormProps) => {
  const dispatch = useAppDispatch()
  const [form] = Form.useForm()
  const { blogData } = useAppSelector((state: RootState) => state.blogs)
  const [addBlog, { isLoading: isAdding }] = useAddBlogMutation()
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation()

  const reactQuillRef = useRef<ReactQuill>(null)
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [uploadFile, { isLoading: isUploading }] = useUpLoadImageBlogMutation()

  const [value, setvalue] = useState(blogData.description)

  blogData._id &&
    form.setFieldsValue({
      name: blogData.name,
      description: blogData.description,
      images: blogData.images[0]?.url
    })

  const onFinish = async (values: IBlogs) => {
    if (blogData._id && fileList.length === 0) {
      updateBlog({ ...values, _id: blogData._id, images: blogData.images })
        .unwrap()
        .then(() => {
          messageAlert('Cập nhật thành công', 'success')
          onClose()
        })
        .catch(() => {
          messageAlert('Cập nhật thất bại', 'error')
        })
      console.log({
        name: values.name,
        description: value
      })
      return
    }
    const formData = new FormData()
    const file = fileList[0]?.originFileObj as RcFile
    formData.append('images', file)
    uploadFile(formData)
      .unwrap()
      .then(({ urls }: any) => {
        if (blogData._id) {
          updateBlog({
            name: values.name,
            description: values.description,
            images: urls[0],
            _id: blogData._id
          })
            .unwrap()
            .then(() => {
              messageAlert('Cập nhật bài viết thành công', 'success')
              onClose()
            })
            .catch(() => {
              messageAlert('Cập nhật bài viết thất bại', 'error')
            })
          console.log({
            name: values.name,
            description: value,
            images: urls[0]
          })
        } else {
          addBlog({
            name: values.name,
            description: values.description,
            images: urls[0]
          })
            .unwrap()
            .then(() => {
              toast.success('Thêm bài viết thành công')
              onClose()
            })
            .catch((error) => {
              toast.error(`Thêm bài viết thất bại! ${error.data.message}`)
              onClose()
            })
        }
      })
  }

  const onClose = () => {
    setFileList([])
    dispatch(setOpenDrawer(false))
    dispatch(setBlog({ _id: '', name: '', description: '', images: [] }))
    form.resetFields()
  }
  const handleProcedureContentChange = (content: string) => {
    setvalue(content)
  }
  return (
    <Drawer
      title={blogData?._id ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới'}
      width={776}
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
        {fileList.length <= 0 && blogData.images && (
          <div>
            <Image src={blogData?.images[0]?.url} width={300} />
          </div>
        )}
        <Form.Item
          className='dark:text-white'
          label='Ảnh bài viết'
          name='images'
          // rules={[{ required: true, message: 'Không được bỏ trống!' }]}
        >
          <UploadFile fileList={fileList} setFileList={setFileList} />
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
          className='dark:text-white mb-17'
          label='Mô tả bài viết'
          name='description'
          rules={[{ required: true, message: 'Không được bỏ trống!' }]}
        >
          <ReactQuill
            className='h-[250px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200'
            ref={reactQuillRef}
            theme='snow'
            placeholder='Start writing...'
            modules={{
              toolbar: {
                container: container
              },
              clipboard: {
                matchVisual: false
              }
            }}
            formats={formats}
            value={value}
            onChange={handleProcedureContentChange}
          />
          {/* <ReactQuill theme='snow' value={value} onChange={handleProcedureContentChange} /> */}
        </Form.Item>
        <Form.Item>
          <Button
            disabled={isAdding || isUploading || isUpdating}
            icon={(isAdding || isUploading || isUpdating) && <LoadingOutlined />}
            styleClass='!w-full mt-5 py-2'
            type='submit'
          >
            {blogData._id ? 'Cập nhật bài viết' : 'Thêm bài viết mới'}
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  )
}
export default FormBlog
