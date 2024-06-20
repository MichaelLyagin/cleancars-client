export interface ICartItem {
    id: number
    user_id: number
    product_id: number
    count: number
  }
  
  export interface IAddToCartFx {
    url: string
    username: string
    product_id: number
  }

  export interface IDeleteToCartFx {
    url: string
    username: string
    product_id: number
    count: number
  }
  
  export interface IUpdateCartItemFx {
    url: string
    username: string
    product_id: number
    count: number
  }
  
  export interface ICartItemCounterProps {
    username: string
    product_id: number
    totalCount: number
    initialCount: number
    onClick: () => void
  }