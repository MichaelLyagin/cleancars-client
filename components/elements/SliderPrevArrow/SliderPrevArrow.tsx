import { ISliderArrow } from '@/types/elements'
import styles from '../../../styles/main/index.module.scss'
import SliderArrow from '../SliderArrow/SliderArrow'

const SliderPrevArrow = (props: ISliderArrow) => (
    <button
      className={`${styles.main__slider__arrow} ${styles.main__slider__arrow_prev} ${props.modeClass}`}
      onClick={props.onClick}
    >
      <span>
        <SliderArrow />
      </span>
    </button>
)

export default SliderPrevArrow