import { IAuthPageInput } from '@/types/auth'
import styles from '@/styles/auth/index.module.scss'

const NameInput = ({ register, errors }: IAuthPageInput) => {
  return (
    <div className={styles.auth__div} >
    <label>
      <div className={styles.auth__input_block}>
        <input
          {...register('name', {
            required: 'Введите имя',
            minLength: 2,
            maxLength: 30,
            pattern: {
              value: /^[а-яА-Яa-zA-ZёЁ0-9_]*$/,
              message: 'Недопустимое значение!',
            },
          })}
          type="text"
          placeholder="Логин"
          className={styles.auth__div__input}
        />
        {errors.name && (
          <span className={styles.error_alert}>{errors.name?.message}</span>
        )}
        {errors.name && errors.name.type === 'minLength' && (
          <span className={styles.error_alert}>Минимум 2 символа!</span>
        )}
        {errors.name && errors.name.type === 'maxLength' && (
          <span className={styles.error_alert}>Не более 15 символов!</span>
        )}
      </div>
    </label>
  </div>
  )
}

export default NameInput