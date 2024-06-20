import { toast } from 'react-toastify'
import {
  addToFavoritesFx,
  removeFromFavoritesFx,
} from '@/app/api/favorites'
import {
    removeFavoritesItem,
    updateFavorites
} from '@/context/favorites'

export const toggleFavoritesItem = async (
  username: string,
  product_id: number,
  isInFavorites: boolean
) => {
  try {
    if (isInFavorites) {
      await removeFromFavoritesFx({
        url: '/favorites/delete-one',
        username: username,
        product_id: product_id
      })
      removeFavoritesItem({username, product_id})
      return
    }

    const data = await addToFavoritesFx({
      url: '/favorites/add',
      username,
      product_id,
    })

    updateFavorites(data)
  } catch (error) {
    console.log((error as Error).message)
  }
}

export const removeItemFromFavorites = async (username: string, product_id: number) => {
  try {
    await removeFromFavoritesFx({
        url: '/favorites/delete-one',
        username,
        product_id,
      })
      removeFavoritesItem({username, product_id})
  } catch (error) {
    console.log((error as Error).message)
  }
}

