import { Button, Modal, Radio } from 'antd'
import { useState } from 'react'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import { useAppSelector } from '~/store/hooks'
import { setOpenModal } from '~/store/slices/Modal'
import { useAppDispatch } from '~/store/store'
import { messageAlert } from '~/utils/messageAlert'

const ModalCancelReason = () => {
  const dispatch = useAppDispatch()
  const { openModal } = useAppSelector((state) => state.modal)
  const { id } = useAppSelector((state) => state.orders)

  const [reason, setReason] = useState('')

  const listReason: string[] = [
    'Không muốn sản phẩm nữa.',
    'Sản phẩm bị hỏng khi nhận hàng.',
    'Sản phẩm không đúng mô tả trên trang web.',
    'Đã tìm thấy một sản phẩm tốt hơn ở nơi khác.',
    'Sản phẩm không còn cần thiết.',
    'Thay đổi ý định mua hàng.',
    'Gặp vấn đề tài chính không thể mua sản phẩm.',
    'Đặt hàng nhầm.',
    'Thời gian giao hàng quá chậm.'
  ]
  const reasonChange = (e: CheckboxChangeEvent) => {
    setReason(e.target.value)
  }
  const onOK = () => {
    dispatch(setOpenModal(false))
    messageAlert(`Đã hủy đơn với lý do: "${reason}"`, 'success', 5)
    setReason('')
  }
  const onCancel = () => {
    setReason('')
    dispatch(setOpenModal(false))
  }
  return (
    <Modal
      open={openModal}
      title='Lý do hủy đơn hàng?'
      destroyOnClose
      onCancel={onCancel}
      footer={[
        <Button hidden={!reason} key='cancel' onClick={onCancel}>
          Hủy
        </Button>,
        <Button key='submit' className='bg-[#D34053] text-white hover:!text-white' onClick={onOK}>
          Xác nhận
        </Button>
      ]}
    >
      {listReason.map((reasonItem, index) => (
        <Radio.Group
          key={index + reasonItem}
          optionType='button'
          buttonStyle='solid'
          size='large'
          onChange={reasonChange}
          value={reason}
          className='w-full my-1'
        >
          <Radio value={reasonItem} className='select-none w-full text-center'>
            {reasonItem}
          </Radio>
        </Radio.Group>
      ))}
    </Modal>
  )
}

export default ModalCancelReason
