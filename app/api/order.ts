import { createEffect } from "effector"
import api from '../axiosClient'
import { ICreateOrderFx } from "@/types/order"
import { toast } from "react-toastify"

export const getOrdersFx = createEffect(async (url: string) => {
    const { data } = await api.get(url)
  
    return data
})

export const updateOrderStatusFx = createEffect(async (url: string) => {
  try {
    const { data } = await api.get(url)
    //toast.success('Заказ оплачен')
    return data
  } catch (error) {
    toast.error((error as Error).message)
  }
})

export const createOrderFx = createEffect(
    async ({ url, client_id, order_date, address, status, payment_method, departure_date, arrival_date}: ICreateOrderFx) => {
      try {
        const { data } = await api.post(url, { client_id, order_date, address, status, payment_method, departure_date, arrival_date })
        toast.success('Заказ оформлен')
        return data
      } catch (error) {
        toast.error((error as Error).message)
      }
    }
  )