//import { $mode } from '@/context/mode'
import { IFilterCheckboxItem } from '@/types/catalog'
import { useStore } from 'effector-react'
import styles from '@/styles/catalog/index.module.scss'

const FilterCheckboxItem = ({
  title,
  checked,
  id,
  event,
}: IFilterCheckboxItem) => {
  //const mode = useStore($mode)
  //const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''

  const handleFilterChange = () =>{
    if(event)
        event({ checked: !checked, id } as IFilterCheckboxItem)
  }

  return (
    <li
      className={styles.catalog__filtersBlock_desktop__brands__list__item}
    >
      <label>
        <input
          type="checkbox"
          checked={checked}
          onChange={handleFilterChange}
        />
        <span>{title}</span>
      </label>
    </li>
  )
}

export default FilterCheckboxItem