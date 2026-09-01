import { InputHTMLAttributes } from 'react'
import styles from './Checkbox.module.css'

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  checked: boolean
}

function Checkbox({ label, checked, className, ...rest }: CheckboxProps) {
  return (
    <label className={[styles.wrap, checked ? styles.checked : '', className || ''].filter(Boolean).join(' ')}>
      <input type="checkbox" className={styles.input} checked={checked} readOnly {...rest} />
      <span className={styles.box}>
        {checked ? (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path d="M20 6 9 17l-5-5" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : null}
      </span>
      <span className={styles.label}>{label}</span>
    </label>
  )
}

export default Checkbox
