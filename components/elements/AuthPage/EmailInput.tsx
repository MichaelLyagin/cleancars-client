import { IAuthPageInput } from '@/types/auth'
import styles from '@/styles/auth/index.module.scss'

const EmailInput = ({ register, errors }: IAuthPageInput) => (
  <div className={styles.auth__div}>
    <label>
    <div className={styles.auth__input_block}>
      <input
        {...register('email', {
          required: 'Введите Email',
          pattern: {
            value: /\S+@\S+\.\S+/,
            message: 'Неправильный Email!',
          },
        })}
        type="email"
        placeholder="Email"
        className={styles.auth__div__input}
      />
      {errors.email && (
        <span>{errors.email?.message}</span>
      )}
      </div>
    </label>
  </div>
)

export default EmailInput