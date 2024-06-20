import { toast } from 'react-toastify'
import {
  addToCartFx,
  removeFromCartFx,
  updateCartItemFx,
} from '@/app/api/cart'
import {
  removeShoppingCartItem,
  updateShoppingCart,
} from '@/context/cart'

export const toggleCartItem = async (
  username: string,
  product_id: number,
  count: number,
  isInCart: boolean
) => {
  try {
    if (isInCart) {
      await removeFromCartFx({
        url: '/cart/delete-one',
        username: username,
        product_id: product_id,
        count: count
      })
      removeShoppingCartItem({username, product_id, count})
      return
    }

    const data = await addToCartFx({
      url: '/cart/add',
      username,
      product_id,
    })

    updateShoppingCart(data)
  } catch (error) {
    console.log((error as Error).message)
  }
}

export const removeItemFromCart = async (username: string, product_id: number, count: number) => {
  try {
    await removeFromCartFx({
        url: '/cart/delete-one',
        username,
        product_id,
        count
      })
    removeShoppingCartItem({username, product_id, count})
  } catch (error) {
    console.log((error as Error).message)
  }
}

