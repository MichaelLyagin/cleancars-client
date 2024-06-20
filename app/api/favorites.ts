import { createEffect } from 'effector-next'
import api from '../axiosClient'
import { IAddToFavoritesFx, IDeleteToFavoritesFx } from '@/types/favorites'


export const getFavoritesItemsFx = createEffect(async (url: string) => {
  const { data } = await api.get(url)

  return data
})

export const addToFavoritesFx = createEffect(
  async ({ url, username, product_id }: IAddToFavoritesFx) => {
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

export const removeFromFavoritesFx = createEffect(
    async ({url, username, product_id}: IDeleteToFavoritesFx) => {
      await api.post(url, {username, product_id})
})