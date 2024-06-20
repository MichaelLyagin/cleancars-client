import { IFilterCheckboxItem } from "@/types/catalog";
import { ICategory, IProducts } from "@/types/products";
import { createDomain } from "effector-next";

const products = createDomain()

export const setProducts = products.createEvent<IProducts>()
export const setProductsCheapFirst = products.createEvent()
export const setProductsExpensiveFirst = products.createEvent()
export const setProductsBrandsId = products.createEvent<IFilterCheckboxItem[]>()
export const updateProductsBrandsId = products.createEvent<IFilterCheckboxItem>()
export const setFilteredProducts = products.createEvent()
export const setBrandFromQuery =
products.createEvent<string[]>()
export const setCategory = products.createEvent<ICategory>()

//Функция для обновления сторов
//payload значение которое мы будем изменять
const updateBrand = (brands: IFilterCheckboxItem[], id: string, payload: Partial<IFilterCheckboxItem>) => 
  brands.map((item) => {
    if(item.id === id){
      return {
        ...item,
        ...payload
      }
    }

    return item
  })


//Создаем стор
export const $products = products
    .createStore<IProducts>({} as IProducts).on(setProducts, (_, parts) => parts)
    .on(setProducts, (_, prod) => prod)
    .on(setProductsCheapFirst, (state) => ({
      ...state,
      rows: state.rows.sort((a, b) => a.price - b.price),
    }))
    .on(setProductsExpensiveFirst, (state) => ({
      ...state,
      rows: state.rows.sort((a, b) => b.price - a.price),
    }))
    /* Сортировку по популярности нужно проводить исходя из таблицы заказов
    .on(setBoilerPartsByPopularity, (state) => ({
      ...state,
      rows: state.rows.sort((a, b) => b.popularity - a.popularity),
    }))*/

    const updateBrandFromQuery = (
      brand: IFilterCheckboxItem[],
      brandFromQuery: string[]
    ) =>
      brand.map((item) => {
        if (brandFromQuery.find((id) => id === item.id)) {
          return {
            ...item,
            checked: true,
          }
        }
    
        return item
      })


export const $productsBrandsId = products
  .createStore<IFilterCheckboxItem[]>({} as IFilterCheckboxItem[])
  .on(setProductsBrandsId, (_, parts) => parts)
  .on(updateProductsBrandsId, (state, payload) => [
    ...updateBrand(state, payload.id as string, {checked: payload.checked}),
  ])
  .on(setBrandFromQuery, (state, brandFromQuery) => [
    ...updateBrandFromQuery(state, brandFromQuery),
  ])

export const $filteredProducts = products
.createStore<IProducts>({} as IProducts)
.on(setFilteredProducts, (_, parts) => parts)

export const $category = products
.createStore<ICategory>({} as ICategory)
.on(setCategory, (_, parts) => parts)