export interface IFavoritesItem {
    id: number
    user_id: number
    product_id: number
  }
  
  export interface IAddToFavoritesFx {
    url: string
    username: string
    product_id: number
  }

  export interface IDeleteToFavoritesFx {
    url: string
    username: string
    product_id: number
  }