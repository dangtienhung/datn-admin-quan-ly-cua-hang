import ToppingList from '../components/ToppingList/ToppingList'

export const items = [
  { key: '1', label: 'Tất cả toppings', children: <ToppingList /> },
  { key: '2', label: 'Topping đã bị xóa', children: 'Content of Tab Pane 2' }
]
