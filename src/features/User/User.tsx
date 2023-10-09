import { Tabs } from 'antd'
import { Breadcrumb, Button, PlusIcon } from '~/components'
import { items } from './data'
import { useAppDispatch } from '~/store/store'
import { useAppSelector } from '~/store/hooks'
import { setOpenDrawer } from '~/store/slices'
import { FormUser } from './components/FormUser'

type UserFeatureProps = {
  data: any
}

const UserFeature = ({ data }: UserFeatureProps) => {
  console.log(data)
  const dispatch = useAppDispatch()
  const { openDrawer } = useAppSelector((state) => state.drawer)

  return (
    <div>
      <Breadcrumb pageName='Người dùng'>
        <Button icon={<PlusIcon />} onClick={() => dispatch(setOpenDrawer(true))}>
          Thêm
        </Button>
      </Breadcrumb>

      <Tabs defaultActiveKey='1' items={items} className='text-white' />
      <FormUser open={openDrawer} />
    </div>
  )
}

export default UserFeature
