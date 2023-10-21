import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface IOrderDetail {
  orderData: {
    key: string
    priceShip: number
    totalPrice: number
    note: string
    products: any
    status: string
    payment: string
    user: {
      username: string
      phone: number | string
      avatar: string
      address: string
    }
    reasonCancelOrder?: string
  }
  id: string
  orderDate: string
}

const initialState: IOrderDetail = {
  orderData: {
    key: '',
    priceShip: 0,
    totalPrice: 0,
    note: '',
    products: [],
    status: '',
    payment: '',
    user: {
      avatar: '',
      phone: '',
      username: '',
      address: ''
    },
    reasonCancelOrder: ''
  },
  id: '',
  orderDate: ''
}

export const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrderData: (state, action: PayloadAction<any>) => {
      state.orderData = action.payload
    },
    setIdOrderCancel: (state, action: PayloadAction<string>) => {
      state.id = action.payload
    },
    setOrderDate: (state, action: PayloadAction<string>) => {
      state.orderDate = action.payload
    }
  }
})

export const { setOrderData, setIdOrderCancel, setOrderDate } = orderSlice.actions
export const orderReducer = orderSlice.reducer
