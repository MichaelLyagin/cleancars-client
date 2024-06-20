
/* eslint-disable prettier/prettier */
import {
    StylesConfig,
    GroupBase,
    CSSObjectWithLabel,
  } from 'react-select'
  import { IOption } from '../../types/common'
  
  export const controlStyles = (
    defaultStyles: CSSObjectWithLabel,
    theme: string
  ) => ({
    ...defaultStyles,
    cursor: 'pointer',
    backgroundColor: 'transparent',
    border: 'none',
    width: '200px',
    height: '40px',
    boxShadow: 'none',
    fontWeight: '300',
    marginBottom: '15px',
    '& .css-1dimb5e-singleValue': {
      color: theme === 'dark' ? '#f2f2f2' : '#222222',
    },
    '& .css-1fdsijx-ValueContainer': {
      marginLeft: '-2px',
      paddingLeft: '0px',
    },
    '@media (max-width: 820px)': {
      width: '200px',
    },
    '@media (max-width: 560px)': {
      width: '177px',
    },
  })
  
  export const menuStyles = (
    defaultStyles: CSSObjectWithLabel,
    theme: string
  ) => ({
    ...defaultStyles,
    boxShadow: '0 4px 20px rgb(0 0 0 / 7%)',
    borderRadius: '4px',
    height: 'auto',
    overflow: 'hidden',
    width: '200px',
    backgroundColor: theme === 'dark' ? '#2d2d2d' : '#f2f2f2f2',
  })
  
  export const selectStyles: StylesConfig<IOption, boolean, GroupBase<IOption>> = {
    indicatorSeparator: () => ({
      border: 'none',
    }),
    dropdownIndicator: (defaultStyles, state) => ({
      ...defaultStyles,
      transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : '',
      color: '#808080',
    }),
    menuList: (defaultStyles) => ({
      ...defaultStyles,
      paddingTop: 0,
      paddingBottom: 0,
      width: '200px'
    }),
    placeholder: (defaultStyles) => ({
      ...defaultStyles,
      color: '#808080',
    }),
  }
  