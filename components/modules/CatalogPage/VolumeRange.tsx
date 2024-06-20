//import { $mode } from '@/context/mode'
import { useStore } from 'effector-react'
import { Range, getTrackBackground } from 'react-range'
import styles from '@/styles/catalog/index.module.scss'
import { IVolumeRangeProps } from '@/types/catalog'

const STEP = 0.1
const MIN = 0.1
const MAX = 5.0

const PriceRange = ({
  volumeRange,
  setVolumeRange,
  setVolumeRangeChanged,
}: IVolumeRangeProps) => {
  //const mode = useStore($mode)
  const mode = 'light';
  //const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''
  const darkModeClass = '';

  const handlePriceRangeChange = (values: number[]) => {
    setVolumeRangeChanged(true) //Пользователь использовал фильтр, изменил диапазон
    setVolumeRange(values) //задаем массив с ценами
  }

  return (
    <div className={styles.catalog__filtersBlock_desktop__price}>
      <div className={`${styles.catalog__filtersBlock_desktop__price__inputs} ${darkModeClass}`}>
        <input
          type="text"
          value={volumeRange[0]}
          placeholder="от 0.1"
          //readOnly
        />
            <span className={styles.catalog__filtersBlock_desktop__price__inputs__border} />
        <input
          type="text"
          value={volumeRange[1]}
          placeholder="до 5.0"
          //readOnly
        />
      </div>
      <Range
        values={volumeRange}
        step={STEP}
        min={MIN}
        max={MAX}
        onChange={handlePriceRangeChange}
        renderTrack={({ props, children }) => (
          <div
            onMouseDown={props.onMouseDown}
            onTouchStart={props.onTouchStart}
            style={{
              ...props.style,
              height: 'auto',
              display: 'flex',
              width: '95%',
              padding: '5px 15px 15px 15px',
            }}
          >
            <div
              ref={props.ref}
              style={{
                height: '5px',
                width: '90%',
                borderRadius: '4px',
                background: getTrackBackground({
                  values: volumeRange,
                  colors: ['#808080', '#3CA444', '#808080'],
                  min: MIN,
                  max: MAX,
                }),
                alignSelf: 'center',
              }}
            >
              {children}
            </div>
          </div>
        )}
        renderThumb={({ props }) => (
          <div
            {...props}
            style={{
              ...props.style,
            }}
          >
            <div
              style={{
                height: '15px',
                width: '15px',
                borderRadius: '50%',
                background: '#FFFFFF',
                border: '3px solid #3CA444',
                boxShadow: '0px 12px 8px -6px rgba(174, 181, 239, 0.2)',
              }}
            />
          </div>
        )}
      />
    </div>
  )
}

export default PriceRange