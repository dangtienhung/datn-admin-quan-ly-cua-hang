export interface ITopping {
  _id: string
  name: string
  slug: string
  price: number
  products: any[]
  isActive: boolean
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export interface IDocsToppings {
  message: string
  data: ITopping[]
}
