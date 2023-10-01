import { Breadcrumb, Button, PlusIcon } from '~/components'
import { Drawer, Space } from 'antd'
import { useEffect, useState } from 'react'

import { ITopping } from '~/types'
import { Tabs } from 'antd'
import { items } from './data'
import { setToppingsList } from '~/store/slices'
import { useAppDispatch } from '~/store/store'

const style = {
  color: '#fff'
}

interface ToppingFeatureProps {
  data: ITopping[]
}

const ToppingFeature = ({ data }: ToppingFeatureProps) => {
  const dispatch = useAppDispatch()

  const [open, setOpen] = useState<boolean>(false)

  const showDrawer = () => {
    setOpen(true)
  }

  const onClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    dispatch(setToppingsList(data))
  }, [dispatch, data])

  return (
    <div>
      <Breadcrumb pageName='Toppings'>
        <Button icon={<PlusIcon />} onClick={showDrawer}>
          Thêm
        </Button>
      </Breadcrumb>
      <Tabs defaultActiveKey='1' items={items} className='text-white' />
      <Drawer
        style={style}
        className='dark:!text-white dark:bg-black'
        title='Multi-level drawer'
        width={720}
        closable={false}
        onClose={onClose}
        open={open}
        extra={
          <Space>
            <Button onClick={onClose} size='md'>
              Cancel
            </Button>
            <Button onClick={onClose}>Submit</Button>
          </Space>
        }
      >
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quibusdam possimus provident cupiditate commodi hic
        temporibus facere quaerat atque vero suscipit.
      </Drawer>
    </div>
  )
}

export default ToppingFeature
