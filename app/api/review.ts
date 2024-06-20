import { createEffect } from "effector"
import api from '../axiosClient'
import { ICreateReviewFx } from "@/types/review"
import { toast } from "react-toastify"

export const getReviewsFx = createEffect(async (url: string) => {
    const { data } = await api.get(url)
  
    return data
})

export const createReviewFx = createEffect(
    async ({ url, product_id, client_id, date, rating, comment}: ICreateReviewFx) => {
      try {
        const { data } = await api.post(url, { product_id, client_id, date, rating, comment })
        toast.success('Отзыв создан')
        return data
      } catch (error) {
        toast.error((error as Error).message)
      }
    }
  )

//Удаление отзыва
export const deleteReviewFx = createEffect(async (url: string) => {
  try {
    const { data } = await api.post(url)
    toast.success('Отзыв удален')
    return data
  } catch (error) {
    toast.error((error as Error).message)
  }
})