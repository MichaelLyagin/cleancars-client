import { IAuthPageInput } from '@/types/auth'
import styles from '@/styles/auth/index.module.scss'

const PasswordInput = ({ register, errors }: IAuthPageInput) => (
  <div className={styles.auth__div}>
    <label>
    <div className={styles.auth__input_block}>
      <input
        {...register('password', {
          required: 'Введите пароль',
          minLength: 4,
          maxLength: 20,
        })}
        type="password"
        placeholder="Пароль"
        className={styles.auth__div__input}
      />
      {errors.password && (
        <span >{errors.password?.message}</span>
      )}
      {errors.password && errors.password.type === 'minLength' && (
        <span>Минимум 4 символа!</span>
      )}
      {errors.password && errors.password.type === 'maxLength' && (
        <span>Не более 20 символов!</span>
      )}
      </div>
    </label>
  </div>
)

export default PasswordInput