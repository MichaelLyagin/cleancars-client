import { createEffect } from 'effector-next'
import api from '../axiosClient'
import { toast } from 'react-toastify'
import { ICreateProduct, IGetProductsFx, IUpdateProduct, IUpdateProductCount } from '@/types/products'

//getBestsellersOrNewPartsFx 
export const getBestsellersFx = createEffect(async (url: string) => {
  const { data } = await api.get(url)

  return data
})

/*getBoilerPartsFx
export const getProductsFx = createEffect(async ({url, limit, offset}: IGetProductsFx) => {
  const { data } = await api.get(url, {limit, offset})

  return data
})*/

//getBoilerPartsFx
export const getProductsFx = createEffect(async (url: string) => {
  const { data } = await api.get(url)

  return data
})

//getBoilerPartFx
export const getProductFx = createEffect(async (url: string) => {
  const { data } = await api.get(url)

  return data
})

//searchPartsFx
export const searchProductsFx = createEffect(
  async ({ url, search }: { url: string; search: string }) => {
    const { data } = await api.post(url, { search })

    return data.rows
  }
)

//getPartByNameFx
export const getProductByNameFx = createEffect(
  async ({ url, name }: { url: string; name: string }) => {
    try {
      const { data } = await api.post(url, { name })

      return data
    } catch (error) {
      toast.error((error as Error).message)
    }
  }
)

//Удаление товара
export const deleteProductFx = createEffect(async (url: string) => {
  try {
    const { data } = await api.post(url)
    toast.success('Товар удален')
    return data
  } catch (error) {
    toast.error((error as Error).message)
  }
})

//Создание продукта
export const createProductFx = createEffect(
  async ({ 
    url, name, despription, img, category_id, price, brand, volume, in_stock, vendor_code, popularity, bestseller 
  }: ICreateProduct) => {
    try {
      const { data } = await api.post(url, { name, despription, img, category_id, price, brand, volume, in_stock, vendor_code, popularity, bestseller })

      toast.success('Продукт создан')
      return data
    } catch (error) {
      toast.error((error as Error).message)
    }
  }
)

//Обновление продукта
export const updateProductFx = createEffect(
  async ({ 
    url, id, name, despription, img, category_id, price, brand, volume, in_stock, vendor_code, popularity, bestseller 
  }: IUpdateProduct) => {
    try {
      const { data } = await api.post(url, { id, name, despription, img, category_id, price, brand, volume, in_stock, vendor_code, popularity, bestseller })

      toast.success('Продукт изменен')
      return data
    } catch (error) {
      toast.error((error as Error).message)
    }
  }
)

//Обновление количества продукта
export const updateProductCountFx = createEffect(
  async ({ 
    url, id, in_stock
  }: IUpdateProductCount) => {
    try {
      const { data } = await api.post(url, { id, in_stock })

      return data
    } catch (error) {
      toast.error((error as Error).message)
    }
  }
)