import { useStore } from 'effector-react'
import { useEffect } from 'react'
import { setMode, $mode } from '../context/mode'

export const useTheme = () => {
  const mode = useStore($mode)

  const toggleTheme = () => {
    if (mode === 'dark') { //Если было dark, то станет light
      localStorage.setItem('mode', JSON.stringify('light'))
      setMode('light')
    } else { //Наоборот
      localStorage.setItem('mode', JSON.stringify('dark'))
      setMode('dark')
    }
  }

  useEffect(() => {
    const localTheme = JSON.parse(localStorage.getItem('mode') as string)

    if (localTheme) {
      setMode(localTheme)
    }
  }, [])

  return { toggleTheme }
}