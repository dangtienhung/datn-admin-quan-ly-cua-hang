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
    user_order?: string
  }
  id: string
  orderDate: {
    startDate: string
    endDate: string
  }
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
    reasonCancelOrder: '',
    user_order: ''
  },
  id: '',
  orderDate: {
    startDate: '',
    endDate: ''
  }
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
    setOrderDate: (state, action: PayloadAction<{ startDate: string; endDate: string }>) => {
      state.orderDate = action.payload
    }
  }
})

export const { setOrderData, setIdOrderCancel, setOrderDate } = orderSlice.actions
export const orderReducer = orderSlice.reducer
