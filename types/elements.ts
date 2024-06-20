import { CustomArrowProps } from 'react-slick'
import { IProduct } from './products'

export interface ISliderArrow extends CustomArrowProps {
  modeClass: string
}

export interface IProductCardProps {
  item: IProduct
}