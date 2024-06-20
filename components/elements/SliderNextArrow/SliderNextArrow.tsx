import { ISliderArrow } from '@/types/elements'
import styles from '../../../styles/main/index.module.scss'
import SliderArrow from '../SliderArrow/SliderArrow'
import { useStore } from 'effector-react'
import { $mode } from '@/context/mode'

const SliderNextArrow = (props: ISliderArrow) => (
    <button
      className={`${styles.main__slider__arrow} ${styles.main__slider__arrow_next} ${props.modeClass}`}
      onClick={props.onClick}
    >
      <span>
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d_3504_1760)">
        <circle cx="24" cy="20" r="20" fill="white"/>
        </g>
        <path d="M21.8749 29.1L30.2999 20.7C30.3999 20.6 30.4709 20.4917 30.5129 20.375C30.5549 20.2583 30.5756 20.1333 30.5749 20C30.5749 19.8667 30.5543 19.7417 30.5129 19.625C30.4716 19.5083 30.4006 19.4 30.2999 19.3L21.8749 10.875C21.6416 10.6417 21.3499 10.525 20.9999 10.525C20.6499 10.525 20.3499 10.65 20.0999 10.9C19.8499 11.15 19.7249 11.4417 19.7249 11.775C19.7249 12.1083 19.8499 12.4 20.0999 12.65L27.4499 20L20.0999 27.35C19.8666 27.5833 19.7499 27.871 19.7499 28.213C19.7499 28.555 19.8749 28.8507 20.1249 29.1C20.3749 29.35 20.6666 29.475 20.9999 29.475C21.3333 29.475 21.6249 29.35 21.8749 29.1Z" fill="black"/>
        <defs>
        <filter id="filter0_d_3504_1760" x="0" y="0" width="48" height="48" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dy="4"/>
        <feGaussianBlur stdDeviation="2"/>
        <feComposite in2="hardAlpha" operator="out"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3504_1760"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3504_1760" result="shape"/>
        </filter>
        </defs>
        </svg>
      </span>
    </button>
)

export default SliderNextArrow