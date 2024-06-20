import { ICartItem } from '@/types/cart'
import { createDomain } from 'effector-next'

const shoppingCart = createDomain()

export const setShoppingCart = shoppingCart.createEvent<ICartItem[]>()
export const updateShoppingCart = shoppingCart.createEvent<ICartItem>()
export const removeShoppingCartItem = shoppingCart.createEvent<{
    username: string
    product_id: number
    count: number
}>()
export const setDisableCart = shoppingCart.createEvent<boolean>()

export const updateCartItemCount = shoppingCart.createEvent<{
    username: string
    product_id: number
    count: number
}>()

const remove = (cartItems: ICartItem[], username: string, product_id: number, count: number) => {
  return cartItems.filter((item) => item.product_id !== product_id)

}

function updateCartItem<T>(
  cartItems: ICartItem[],
  username: string,
  product_id: number,
  count: number,
) {
  return cartItems.map((item) => {
    if (item.product_id === product_id) {
      return {
        ...item,
      }
    }

    return item
  })
}

export const $shoppingCart = shoppingCart
  .createStore<ICartItem[]>([])
  .on(setShoppingCart, (_, shoppingCart) => shoppingCart)
  .on(updateShoppingCart, (state, cartItem) => [...state, cartItem])
  .on(removeShoppingCartItem, (state, {username, product_id, count}) => [...remove(state, username, product_id, count)])
  .on(updateCartItemCount, (state, { username, product_id, count }) => [
    ...updateCartItem(state, username, product_id, count),
  ])

export const $disableCart = shoppingCart
  .createStore<boolean>(false)
  .on(setDisableCart, (_, value) => value)