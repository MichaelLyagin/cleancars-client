import { createEffect } from "effector"
import api from '../axiosClient'
import { ICheckOrderItemFx, ICreateOrderItemFx } from "@/types/order-item"

export const getOrderItemsFx = createEffect(async (url: string) => {
    const { data } = await api.get(url)
  
    return data
})

export const createOrderItemFx = createEffect(
    async ({ url, order_id, product_id, quantity, price}: ICreateOrderItemFx) => {
      const { data } = await api.post(url, { order_id, product_id, quantity, price })
  
      return data
    }
  )

export const checkOrderItemFx = createEffect(
  async ({ url, order_id, product_id }: ICheckOrderItemFx) => {
    const { data } = await api.post(url, { order_id, product_id })

    return data
  }
)