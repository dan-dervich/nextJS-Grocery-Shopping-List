import { InputHTMLAttributes, forwardRef, useState } from 'react'
import styles from './Input.module.css'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helpText?: string
}

const EyeIcon = ({ open }: { open: boolean }) => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
    {open ? (
      <>
        <path d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
      </>
    ) : (
      <>
        <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M10.6 5.1c.45-.07.92-.1 1.4-.1 7 0 10.5 7 10.5 7-.6 1.2-1.5 2.6-2.7 3.9M6.6 6.6C3.9 8.3 1.5 12 1.5 12s3.5 7 10.5 7c1.6 0 3-.35 4.2-.9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9.9 10c-.25.4-.4.85-.4 1.35 0 1.4 1.1 2.5 2.5 2.5.5 0 .95-.15 1.35-.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </>
    )}
  </svg>
)

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, helpText, type, className, ...rest },
  ref
) {
  const [visible, setVisible] = useState(false)
  const isPassword = type === 'password'
  const resolvedType = isPassword ? (visible ? 'text' : 'password') : type

  return (
    <div className={[styles.field, error ? styles.error : '', className || ''].filter(Boolean).join(' ')}>
      <label className={styles.label}>
        {label ? <span>{label}</span> : null}
        <div className={styles.inputWrap}>
          <input
            ref={ref}
            type={resolvedType}
            className={[styles.input, isPassword ? styles.hasToggle : ''].filter(Boolean).join(' ')}
            aria-invalid={!!error}
            {...rest}
          />
          {isPassword ? (
            <button
              type="button"
              className={styles.toggleBtn}
              onClick={() => setVisible((v) => !v)}
              aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              tabIndex={-1}
            >
              <EyeIcon open={visible} />
            </button>
          ) : null}
        </div>
      </label>
      {error ? (
        <p className={styles.errorText} role="alert">
          {error}
        </p>
      ) : helpText ? (
        <p className={styles.helpText}>{helpText}</p>
      ) : null}
    </div>
  )
})

export default Input
