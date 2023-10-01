import { ITopping } from '~/types'
import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

interface IToppingState {
  toppingsList: ITopping[]
  toppingError: null | string
  toppingLoading: boolean
}

const initialState: IToppingState = {
  toppingsList: [],
  toppingError: null,
  toppingLoading: false
}

const toppingSlice = createSlice({
  name: 'toppings',
  initialState,
  reducers: {
    /* lưu data topping */
    setToppingsList: (state, action: PayloadAction<ITopping[]>) => {
      state.toppingsList = action.payload
    },
    setToppingError: (state, action: PayloadAction<string>) => {
      state.toppingError = action.payload
    },
    setToppingLoading: (state, action: PayloadAction<boolean>) => {
      state.toppingLoading = action.payload
    }
  }
})

export const { setToppingsList, setToppingLoading, setToppingError } = toppingSlice.actions

export const toppingReducers = toppingSlice.reducer
