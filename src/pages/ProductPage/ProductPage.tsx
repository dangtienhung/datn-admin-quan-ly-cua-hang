import { Breadcrumb } from '~/components'
import { FeatureProducts } from '~/features'

const ProductPage = () => {
  return (
    <div>
      <Breadcrumb pageName='products' />
      <FeatureProducts />
    </div>
  )
}

export default ProductPage
