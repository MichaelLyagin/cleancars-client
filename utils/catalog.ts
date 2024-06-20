import { getProductsFx } from "@/app/api/products"
import { setFilteredProducts } from "@/context/products"
import { NextRouter } from "next/router"
import { getQueryParamOnFirstRender } from "./common"

const createBrandCheckboxObj = (id:number, title: string) => ({
    title,
    checked: false,
    id: id,
  })

  export async function updateParamsAndFilters<T>(
    updatedParams: T,
    path: string,
    router: NextRouter
  ) {
    const params = router.query
  
    delete params.brand
    delete params.priceFrom
    delete params.priceTo
    delete params.volumeFrom
    delete params.volumeTo
  
    router.push(
      {
        query: {
          ...params,
          ...updatedParams,
        },
      },
      undefined,
      { shallow: true }
    )
  
    const data = await getProductsFx(`/products?limit=6&offset=${path}`)
  
    setFilteredProducts(data)
  }

  const checkPriceFromQuery = (price: number) =>
    price && !isNaN(price) && price >= 10 && price <= 5000

  const checkVolumeFromQuery = (volume: number) =>
    volume && !isNaN(volume) && volume >= 100 && volume <= 5000

  export const checkQueryParams = (router: NextRouter) => {
    const priceFromQueryValue = getQueryParamOnFirstRender(
      'priceFrom',
      router
    ) as string
    const priceToQueryValue = getQueryParamOnFirstRender(
      'priceTo',
      router
    ) as string
    const volumeFromQueryValue = getQueryParamOnFirstRender(
      'volumeFrom',
      router
    ) as string
    const volumeToQueryValue = getQueryParamOnFirstRender(
      'volumeTo',
      router
    ) as string
   // const categoryFromQueryValue = getQueryParamOnFirstRender(
   //   'category',
   //   router
   // ) as string
    const brandQueryValue = JSON.parse(
      decodeURIComponent(getQueryParamOnFirstRender('brand', router) as string)
    )
    const isValidBrandQuery =
      Array.isArray(brandQueryValue) && !!brandQueryValue?.length
    const isValidPriceQuery =
      checkPriceFromQuery(+priceFromQueryValue) &&
      checkPriceFromQuery(+priceToQueryValue)

    const isValidVolumeQuery =
      checkVolumeFromQuery(+volumeFromQueryValue) &&
      checkVolumeFromQuery(+volumeToQueryValue)
  
    return {
      isValidBrandQuery,
      isValidPriceQuery,
      isValidVolumeQuery,
      priceFromQueryValue,
      priceToQueryValue,
      volumeFromQueryValue,
      volumeToQueryValue,
      brandQueryValue,
      //categoryFromQueryValue
    }
  }

  export const updateParamsAndFiltersFromQuery = async (
    callback: VoidFunction,
    path: string
  ) => {
    callback()
  
    const data = await getProductsFx(`/products?limit=6&offset=${path}`)
  
    setFilteredProducts(data)
  }