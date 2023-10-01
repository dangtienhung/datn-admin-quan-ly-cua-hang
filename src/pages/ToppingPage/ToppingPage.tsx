import { Breadcrumb, Button, PlusIcon } from '~/components'

import { NotFound } from '..'
import { ToppingFeature } from '~/features'
import { useGetAllToppingsQuery } from '~/store/services'

const ToppingPage = () => {
  const { isError: errorTopping, isFetching: fetchingTopping, data: toppingData } = useGetAllToppingsQuery()

  if (errorTopping || !toppingData) {
    return <NotFound />
  }

  if (fetchingTopping) {
    return <div>Loading...</div>
  }

  return (
    <>
      <ToppingFeature data={toppingData?.data} />
    </>
  )
}

export default ToppingPage
