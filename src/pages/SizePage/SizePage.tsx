import { FeatureSize } from '~/features'
import { NotFound } from '..'
import { useGetAllSizesQuery } from '~/store/services'

const SizePage = () => {
  const { isError: errorSize, isLoading: loadingSize, data: dataSize } = useGetAllSizesQuery(1)

  if (loadingSize) {
    return <div>Loading...</div>
  }

  if (errorSize || !dataSize) {
    return <NotFound />
  }

  return <FeatureSize />
}

export default SizePage
