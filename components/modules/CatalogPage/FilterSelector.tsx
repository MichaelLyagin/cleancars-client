import { IOption, SelectOptionType } from "@/types/common"
import { categoriesOptions } from "@/utils/SelectContents"
import { createSelectOption } from "@/utils/common"
import {
    controlStyles,
    menuStyles,
    selectStyles,
  } from '@/styles/catalog/select'
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Select from "react-select"
import { optionStyles } from "@/styles/searchInput"
import { $products, setProductsCheapFirst, setProductsExpensiveFirst } from "@/context/products"
import { useStore } from "effector-react"

const FilterSelector = ({
  setSpinner,
}: {
  setSpinner: (arg0: boolean) => void
}) => {
    const [categoryOption, setCategoryOption] = useState<SelectOptionType>(null); //опция сортировки
    const router = useRouter();
    const mode: string = '';
    const products = useStore($products);

    //Квери параметры для сортировки. first эта выбранная опция сортировки. 
    //Квери параметры сохраняются при перезагрузке  
    const updateRouteParam = (first: string) =>
      router.push(
        {
          query: {
            ...router.query,
            first,
          },
        },
        undefined,
        { shallow: true }
      )

      const updateCategoryOption = (value: string) =>
        setCategoryOption({ value, label: value })

      //Проверка на наличие квери параметров, если они есть то установи их
      useEffect(() => {
        if (products.rows) {//если данные уже пришли
          switch (router.query.first) {
            case 'cheap':
              updateCategoryOption('Сначала дешевые')
              setProductsCheapFirst()
              break
            case 'expensive':
              updateCategoryOption('Сначала дорогие')
              setProductsExpensiveFirst()
              break
            /*
            case 'popular':
              updateCategoryOption('По популярности')
              setBoilerPartsByPopularity()
              break
              */
            default:
              updateCategoryOption('Сначала дешевые')
              setProductsCheapFirst()
              break
          }
        }
      }, [products.rows, router.query.first])  

    const handleSortOptionChange = (selectedOption: SelectOptionType) => {
        setSpinner(true)
        setCategoryOption(selectedOption)
    
        switch ((selectedOption as IOption).value) {
          case 'Сначала дешевые':
            setProductsCheapFirst()
            updateRouteParam('cheap')
            break
          case 'Сначала дорогие':
            setProductsExpensiveFirst()
            updateRouteParam('expensive')
            break
          /*
          case 'По популярности':
            setBoilerPartsByPopularity()
            updateRoteParam('popular')
            break
            */
        }
    
        setTimeout(() => setSpinner(false), 1000)
      }

    return (
        <Select
        placeholder=""
        value={categoryOption || createSelectOption('Сначала дешевые')}
        onChange={handleSortOptionChange}
        styles={{
          ...selectStyles,
          control: (defaultStyles) => ({
            ...controlStyles(defaultStyles, mode),
          }),
          input: (defaultStyles) => ({
            ...defaultStyles,
            color: mode === 'dark' ? '#f2f2f2' : '#222222',
          }),
          menu: (defaultStyles) => ({
            ...menuStyles(defaultStyles, mode),
          }),
          option: (defaultStyles, state) => ({
            ...optionStyles(defaultStyles, state, mode),
          }),
        }}
        isSearchable={false}
        options={categoriesOptions}
      />
    )
}

export default FilterSelector