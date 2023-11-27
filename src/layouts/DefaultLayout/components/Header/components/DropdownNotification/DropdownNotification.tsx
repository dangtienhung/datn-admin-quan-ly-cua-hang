/* eslint-disable react-hooks/exhaustive-deps */

import { Badge, Empty } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { useGetAllOrderPendingQuery, useUpdateNotificationMutation } from '~/store/services'

import { BellIcon } from '~/components'
import { ClientSocket } from '~/socket'
import { IOrder } from '~/types'
import { Link } from 'react-router-dom'
import { RootState } from '~/store/store'
import { formatDate } from '~/utils/formatDate'
import { useAppSelector } from '~/store/hooks'

const DropdownNotification = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [notification, setNotification] = useState<any[]>([])

  const { user } = useAppSelector((state: RootState) => state.persistedReducer.auth)

  const [options, setoptions] = useState({
    page: 1,
    limit: 10,
    startDate: '',
    endDate: '',
    room: user?._id
  })
  const trigger = useRef<any>(null)
  const dropdown = useRef<any>(null)
  const [updateNotification] = useUpdateNotificationMutation()
  const { data: dataOrderPendings } = useGetAllOrderPendingQuery(options)

  const handleUpdateNotification = (id: string) => {
    updateNotification(id)
      .unwrap()
      .then(() => {
        ClientSocket.getUnReadNotification(setNotification)
      })
  }
  useEffect(() => {
    const handleDropdown = (e: MouseEvent) => {
      e.target == trigger.current || trigger.current.contains(e.target)
        ? dropdownOpen
          ? setDropdownOpen(true)
          : setDropdownOpen(false)
        : setDropdownOpen(false)
    }
    document.addEventListener('click', handleDropdown)
    return () => document.removeEventListener('click', handleDropdown)
  }, [dropdownOpen])

  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!dropdownOpen || keyCode !== 27) return
      setDropdownOpen(false)
    }
    document.addEventListener('keydown', keyHandler)
    return () => document.removeEventListener('keydown', keyHandler)
  }, [])

  useEffect(() => {
    ClientSocket.getUnReadNotification(setNotification)
  }, [])

  return (
    <li className='relative'>
      <Badge count={dataOrderPendings?.docs?.length || 0}>
        <Link
          ref={trigger}
          onClick={() => setDropdownOpen(!dropdownOpen)}
          to='#'
          className='relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white'
        >
          {/* {notification.length > 0 && (
            <span className='absolute -top-[5px] right-0 z-1 h-3 w-3 rounded-full bg-meta-1'>
              <span className='-z-1 animate-ping bg-meta-1 absolute inline-flex w-full h-full rounded-full opacity-75'></span>
            </span>
          )} */}

          <BellIcon />
        </Link>
      </Badge>

      <div
        ref={dropdown}
        onFocus={() => setDropdownOpen(true)}
        onBlur={() => setDropdownOpen(false)}
        className={`absolute -right-27 mt-2.5 flex max-h-90 w-75 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark sm:right-0 sm:w-80 ${
          dropdownOpen === true ? 'block' : 'hidden'
        }`}
      >
        <div className='px-4.5 py-3'>
          <h5 className='text-bodydark2 text-sm font-medium'>Thông báo</h5>
        </div>

        <ul className='flex flex-col h-auto overflow-y-auto hidden-scroll-bar'>
          {dataOrderPendings && dataOrderPendings?.docs?.length > 0 ? (
            dataOrderPendings?.docs?.map((item: IOrder, index: number) => (
              <li key={index}>
                <Link
                  onClick={() => {
                    handleUpdateNotification(item._id)
                    setDropdownOpen(false)
                  }}
                  key={item._id + 9}
                  className='flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4'
                  to={`/manager/orders`}
                >
                  <p className='text-sm'>
                    <span className='dark:text-white text-black'>
                      Đơn hàng "{item._id}" vừa được tạo bởi khách hàng "{item?.user?.username}" và đang chờ xác nhận.
                    </span>
                  </p>
                  <p className='text-xs'>{formatDate(item.createdAt)}</p>
                </Link>
              </li>
            ))
          ) : (
            <Empty
              className='flex items-center flex-col mb-2'
              image='https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg'
              imageStyle={{ height: 200 }}
              description={<span>Hiện tại không có thông báo nào!</span>}
            />
          )}
        </ul>
      </div>
    </li>
  )
}

export default DropdownNotification
