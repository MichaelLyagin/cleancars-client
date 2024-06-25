import { getProductByNameFx, searchProductsFx } from '@/app/api/products'
import { $searchInputZIndex, setSearchInputZIndex } from '@/context/header'
import { $mode } from '@/context/mode'
import { useDebounceCallback } from '@/hooks/useDebounceCallback'
import styles from '@/styles/header/index.module.scss'
import { controlStyles, inputStyles, menuStyles, optionStyles } from '@/styles/searchInput'
import { IOption, SelectOptionType } from '@/types/common'
import { IProduct } from '@/types/products'
import { createSelectOption, removeClassNamesForOverlayAndBody, toggleClassNamesForOverlayAndBody } from '@/utils/common'
import { useStore } from 'effector-react'
import { useRouter } from 'next/router'
import { MutableRefObject, useRef, useState } from 'react'
import Select from 'react-select'
import { toast } from 'react-toastify'

const SearchInput = () => {
    const mode = useStore($mode)
    const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''
    const zIndex = useStore($searchInputZIndex)
    const [searchOption, setSearchOption] = useState<SelectOptionType>(null)
    const [onMenuOpenControlStyles, setOnMenuOpenControlStyles] = useState({})
    const [onMenuOpenContainerStyles, setOnMenuOpenContainerStyles] = useState({})
    const btnRef = useRef() as MutableRefObject<HTMLButtonElement>
    const borderRef = useRef() as MutableRefObject<HTMLSpanElement>
    const [options, setOptions] = useState([])
    const [inputValue, setInputValue] = useState('')
    const delayCallback = useDebounceCallback(1000)
    const router = useRouter()

    const handleSearchOptionChange = (selectedOption: SelectOptionType) => {
        if (!selectedOption) {
          setSearchOption(null)
          return
        }
    
        const name = (selectedOption as IOption)?.value as string
    
        if (name) {
          getPartAndRedirect(name)
        }
    
        setSearchOption(selectedOption)
        removeClassNamesForOverlayAndBody()
      }
    
      const onFocusSearch = () => {
        toggleClassNamesForOverlayAndBody('open-search')
        setSearchInputZIndex(100)
      }
    
      const handleSearchClick = async () => {
        if (!inputValue) {
          return
        }
    
        getPartAndRedirect(inputValue)
      }
    
      const searchPart = async (search: string) => {
        try {
          setInputValue(search)
          const data = await searchProductsFx({
            url: '/products/search',
            search,
          })
    
          const names = data
            .map((item: IProduct) => item.name)
            .map(createSelectOption)
    
          setOptions(names)
        } catch (error) {
          toast.error((error as Error).message)
        }
      }
    
      const getPartAndRedirect = async (name: string) => {
        const part = await getProductByNameFx({
          url: '/products/name',
          name,
        })
    
        if (!part.id) {
          toast.warning('Товар не найден.')
          return
        }
    
        router.push(`/catalog/${part.id}`)
      }
    
      const onSearchInputChange = (text: string) => {
        document.querySelector('.overlay')?.classList.add('open-search')
        document.querySelector('.body')?.classList.add('overflow-hidden')
    
        delayCallback(() => searchPart(text))
      }
    
      const onSearchMenuOpen = () => {
        setOnMenuOpenControlStyles({
          borderBottomLeftRadius: 0,
          border: 'none',
        })
        setOnMenuOpenContainerStyles({
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
        })
    
        btnRef.current.style.border = 'none'
        btnRef.current.style.borderBottomRightRadius = '0'
        borderRef.current.style.display = 'block'
      }
    
      const onSearchMenuClose = () => {
        setOnMenuOpenControlStyles({
          borderBottomLeftRadius: 4,
          boxShadow: 'none',
          border: '1px solid #9e9e9e',
        })
        setOnMenuOpenContainerStyles({
          boxShadow: 'none',
        })
    
        btnRef.current.style.border = '1px solid #9e9e9e'
        btnRef.current.style.borderLeft = 'none'
        btnRef.current.style.borderBottomRightRadius = '4px'
        borderRef.current.style.display = 'none'
      }
    
    return (
        <div className={styles.header__search__container}>
        <div className={styles.header__search__inner}>
            <Select
            placeholder="Поиск"
            value={searchOption}
            onChange={handleSearchOptionChange}
            styles={{
                ...inputStyles,
                container: (defaultStyles) => ({
                ...defaultStyles,
                ...onMenuOpenContainerStyles,
                }),
                control: (defaultStyles) => ({
                ...controlStyles(defaultStyles, mode),
                backgroundColor: mode === 'dark' ? '#2d2d2d' : '#ffffff',
                zIndex,
                transition: 'none',
                ...onMenuOpenControlStyles,
                }),
                input: (defaultStyles) => ({
                ...defaultStyles,
                color: mode === 'dark' ? '#f2f2f2' : '#222222',
                }),
                menu: (defaultStyles) => ({
                ...menuStyles(defaultStyles, mode),
                zIndex,
                marginTop: '-1px',
                }),
                option: (defaultStyles, state) => ({
                ...optionStyles(defaultStyles, state, mode),
                }),
            }}
            isClearable={true}
            openMenuOnClick={false}
            onFocus={onFocusSearch}
            onMenuOpen={onSearchMenuOpen}
            onMenuClose={onSearchMenuClose}
            onInputChange={onSearchInputChange}
            options={options}
            />
            <span ref={borderRef} className={styles.header__search__border} />
            </div>
                {/*<input className={`${darkModeClass}`} type="text" placeholder="Поиск" />*/}
                <button className={`${styles.header__search__btn} ${darkModeClass}`} ref={btnRef} onClick={handleSearchClick} style={{ zIndex }}>
                    <span className={styles.header__search__btn__span}>
                        <svg width="40" height="38" viewBox="0 0 40 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M31.5 32.1417L22.1667 23.275C21.3333 23.9083 20.375 24.4097 19.2917 24.7792C18.2083 25.1486 17.0556 25.3333 15.8333 25.3333C12.8056 25.3333 10.2433 24.3369 8.14667 22.344C6.05 20.3511 5.00111 17.917 5 15.0417C5 12.1653 6.04889 9.73117 8.14667 7.73933C10.2444 5.7475 12.8067 4.75106 15.8333 4.75C18.8611 4.75 21.4233 5.74644 23.52 7.73933C25.6167 9.73222 26.6656 12.1663 26.6667 15.0417C26.6667 16.2028 26.4722 17.2979 26.0833 18.3271C25.6944 19.3562 25.1667 20.2667 24.5 21.0583L33.875 29.9646C34.1806 30.2549 34.3333 30.6111 34.3333 31.0333C34.3333 31.4556 34.1667 31.825 33.8333 32.1417C33.5278 32.4319 33.1389 32.5771 32.6667 32.5771C32.1944 32.5771 31.8056 32.4319 31.5 32.1417ZM15.8333 22.1667C17.9167 22.1667 19.6878 21.4737 21.1467 20.0877C22.6056 18.7018 23.3344 17.0198 23.3333 15.0417C23.3333 13.0625 22.6039 11.3799 21.145 9.994C19.6861 8.60806 17.9156 7.91561 15.8333 7.91667C13.75 7.91667 11.9789 8.60964 10.52 9.99558C9.06111 11.3815 8.33222 13.0636 8.33333 15.0417C8.33333 17.0208 9.06278 18.7034 10.5217 20.0893C11.9806 21.4753 13.7511 22.1677 15.8333 22.1667Z" fill="white"/>
                        </svg>
                    </span>
                </button>
        </div>
    )
}

export default SearchInput