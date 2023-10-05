import { UserFeature } from '~/features'
import { useGetAllUserQuery } from '~/store/services/Users'
import Loading from '~/components/Loading/Loading'

// type Props = {}

const UserPage = () => {
  const { isLoading, data: users, isError } = useGetAllUserQuery()
  // if (isError) {
  //   return <NotFound />
  // }
  if (isLoading) {
    return <Loading />
  }
  return (
    <>
      <UserFeature data={users} />
    </>
  )
}

export default UserPage
