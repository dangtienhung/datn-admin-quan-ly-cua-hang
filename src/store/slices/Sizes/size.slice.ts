import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { ISize } from '~/types'

interface SizeState {
  sizeList: ISize[]
  size: ISize | null
  sizeId: string | null
}

const initialState: SizeState = {
  sizeList: [],
  size: null,
  sizeId: null
}

export const sizeSlice = createSlice({
  name: 'sizes',
  initialState,
  reducers: {
    setSizes: (state, action: PayloadAction<ISize[]>) => {
      state.sizeList = action.payload
    }
  }
})

export const { setSizes } = sizeSlice.actions

export const sizeReducers = sizeSlice.reducer
