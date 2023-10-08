import { useGetAllVouchersQuery } from '~/store/services'
import { NotFound } from '..'
import VoucherFeature from '~/features/Voucher/Voucher'

const VoucherPage = () => {
  const { isError: errorVoucher, isFetching: fetchingVoucher, data: voucherData } = useGetAllVouchersQuery(0)
  // console.log(voucherData)

  if (errorVoucher || !voucherData) {
    return <NotFound />
  }
  if (fetchingVoucher) {
    return <div>Loading...</div>
  }
  return (
    <>
      <VoucherFeature data={voucherData.data.docs} />
    </>
  )
}

export default VoucherPage
