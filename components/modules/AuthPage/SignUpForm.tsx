import { useForm } from 'react-hook-form'
import { useState } from 'react'
import NameInput from '@/components/elements/AuthPage/NameInput'
import { IInputs } from '@/types/auth'
import EmailInput from '@/components/elements/AuthPage/EmailInput'
import PasswordInput from '@/components/elements/AuthPage/PasswordInput'
import { singUpFx } from '@/app/api/auth'
import { showAuthError } from '@/utils/errors'
import styles from '@/styles/auth/index.module.scss'
import spinnerStyles from '@/styles/spinner/index.module.scss'

interface SignUpFormProp {
    switchForm: () => void;
  }

const SignUpForm = ({switchForm}: SignUpFormProp) => {
  const [spinner, setSpinner] = useState(false)

  const {
    register,
    formState: { errors },
    handleSubmit,
    resetField,
  } = useForm<IInputs>()

  const onSubmit = async (data: IInputs) => {
    try {
      const userData = await singUpFx({
        url: '/users/signup',
        username: data.name,
        password: data.password,
        email: data.email,
      })

      if (!userData) {
        return
      }

      resetField('email')
      resetField('name')
      resetField('password')
      switchForm()
    } catch (error) {
      showAuthError(error)
    } finally {
      setSpinner(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2 className={styles.auth__title}>Регистрация</h2>
      <NameInput register={register} errors={errors} />
      <EmailInput register={register} errors={errors} />
      <PasswordInput register={register} errors={errors} />
      <div className={styles.auth__login__div}>
        <button className={styles.auth__login}>
          {spinner ? <div>Загрузка...</div> : <div>Зарегистрироваться</div>}
        </button>   
      </div>
    </form>
  )
}

export default SignUpForm;