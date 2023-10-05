import { FeatureSize } from '~/features'
import { NotFound } from '..'
import { useGetAllSizesQuery } from '~/store/services'

const SizePage = () => {
  const { isError: errorSize, isLoading: loadingSize, data: dataSize } = useGetAllSizesQuery()

  if (loadingSize) {
    return <div>Loading...</div>
  }

  if (errorSize || !dataSize) {
    return <NotFound />
  }

  return <FeatureSize data={dataSize} />
}

export default SizePage
