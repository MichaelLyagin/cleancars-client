import { createEffect } from 'effector-next'
import api from '../axiosClient'
import { IAddToCartFx, IDeleteToCartFx, IUpdateCartItemFx } from '@/types/cart'


export const getCartItemsFx = createEffect(async (url: string) => {
  const { data } = await api.get(url)

  return data
})

export const addToCartFx = createEffect(
  async ({ url, username, product_id }: IAddToCartFx) => {
    const { data } = await api.post(url, { username, product_id })

    return data
  }
)

/*
export const removeFromCartFx = createEffect(
    async ({url, username, product_id, count}: IDeleteToCartFx) => {
      await api.delete(url, {username, product_id, count})
})
*/

export const removeFromCartFx = createEffect(
    async ({url, username, product_id, count}: IDeleteToCartFx) => {
      await api.post(url, {username, product_id, count})
})

export const removeAllFromCartFx = createEffect(async (url: string) => {
  await api.delete(url)
})

export const updateCartItemFx = createEffect(
  async ({ url, username, product_id, count }: IUpdateCartItemFx) => {
    const { data } = await api.post(url, {username, product_id, count})

    return data
  }
)