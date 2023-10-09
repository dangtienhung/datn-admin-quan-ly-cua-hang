import { IVoucher } from '~/types'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface IVoucherState {
  voucherData: {
    _id?: string
    code: string
    discount: number
    sale: number
  }
}
const initialState: IVoucherState = {
  voucherData: {
    _id: '',
    code: '',
    discount: 0,
    sale: 0
  }
}
export const voucherSlice = createSlice({
  name: 'vouchers',
  initialState,
  reducers: {
    setVoucher: (state, action: PayloadAction<IVoucher>) => {
      state.voucherData = action.payload
    }
  }
})

export const { setVoucher } = voucherSlice.actions

export const voucherReducer = voucherSlice.reducer
