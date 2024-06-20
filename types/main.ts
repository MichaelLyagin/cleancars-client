import { IProduct } from './products'

export interface IMainPageSlider {
  items: IProduct[]
  spinner: boolean
  goToPartPage?: boolean
}

export interface ICartAlertProps {
  count: number
  closeAlert: VoidFunction
}