import { ICategoryRefProduct } from '../Category'
import { IImage } from '../Image'
import { ISizeRefProduct } from '../Size'
import { IToppingRefProduct } from '..'

export interface ISale {
  value: number
  isPercent: boolean
}

export interface IProduct {
  _id: string
  name: string
  sale: ISale
  images: IImage[]
  description: string
  category: ICategoryRefProduct
  sizes: ISizeRefProduct[]
  toppings: IToppingRefProduct[]
}
