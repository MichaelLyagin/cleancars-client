import { Event } from 'effector-next'

export interface IQueryParams {
  offset: string
  first: string //опция сортировки
  category: string
  brand: string //Производитель
  priceFrom: string
  priceTo: string
  volumeFrom: string
  volumeTo: string
  productId: string
}

export interface IFilterCheckboxItem {
  title: string
  checked: boolean
  id?: string
  //id?: number
  event?: Event<IFilterCheckboxItem>
}

export interface ITextArray {
  id: number
  text: string
}

export interface IBrandAccordionProps {
  brandList: IFilterCheckboxItem[]
  title: string | false
  setBrand: Event<IFilterCheckboxItem[]>
  updateBrand: Event<IFilterCheckboxItem>
}

export interface ICatalogBaseTypes {
  priceRange: number[]
  setPriceRange: (arg0: number[]) => void
  setPriceRangeChanged: (arg0: boolean) => void //Использовал ли пользователь фильтр диапазона цены
}

export type IPriceRangeProps = ICatalogBaseTypes

export interface IVolumeRangeProps {
  volumeRange: number[]
  setVolumeRange: (arg0: number[]) => void
  setVolumeRangeChanged: (arg0: boolean) => void //Использовал ли пользователь фильтр диапазона цены
}

export interface ICatalogFilterDesktopProps
  extends ICatalogBaseTypes, 
  ICatalogFiltersBaseTypes,
  IVolumeRangeProps {
  spinner: boolean
  applyFilters: VoidFunction
}

interface ICatalogFiltersBaseTypes {
  resetFilterBtnDisabled: boolean
  resetFilters: VoidFunction
}

export interface ICatalogFiltersProps
  extends ICatalogBaseTypes,
    ICatalogFiltersBaseTypes, 
    IVolumeRangeProps {
  priceRangeChanged: boolean
  volumeRangeChanged: boolean
  currentPage: number
  setIsFilterInQuery: (arg0: boolean) => void
  //closePopup: VoidFunction
  //filtersMobileOpen: boolean
}