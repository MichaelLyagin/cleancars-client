import { AxiosError } from 'axios'
import { toast } from 'react-toastify'
import { HTTPStatus } from '@/constants'

export const showAuthError = (error: unknown) => {
  const axiosError = error as AxiosError

  if (axiosError.response) { //Если ошибка есть?
    if (axiosError.response.status === HTTPStatus.UNAUTHORIZED) {
      toast.error('Неверное имя пользователя или пароль')
      return
    }
  }

  toast.error((error as Error).message)
}