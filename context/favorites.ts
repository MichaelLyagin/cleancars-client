import { IFavoritesItem } from '@/types/favorites'
import { createDomain } from 'effector-next'

const favorites = createDomain()

export const setFavorites = favorites.createEvent<IFavoritesItem[]>()
export const updateFavorites = favorites.createEvent<IFavoritesItem>()
export const removeFavoritesItem = favorites.createEvent<{
    username: string
    product_id: number
}>()
export const setDisableFavorites = favorites.createEvent<boolean>()

const remove = (cartItems: IFavoritesItem[], username: string, product_id: number) => {
  return cartItems.filter((item) => item.product_id !== product_id)

}

export const $favorites = favorites
  .createStore<IFavoritesItem[]>([])
  .on(setFavorites, (_, favorites) => favorites)
  .on(updateFavorites, (state, favoritesItem) => [...state, favoritesItem])
  .on(removeFavoritesItem, (state, {username, product_id}) => [...remove(state, username, product_id)])

export const $disableFavorites = favorites
  .createStore<boolean>(false)
  .on(setDisableFavorites, (_, value) => value)