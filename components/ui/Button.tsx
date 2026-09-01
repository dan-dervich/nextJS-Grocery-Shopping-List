import { ButtonHTMLAttributes, ReactNode } from 'react'
import Link from 'next/link'
import styles from './Button.module.css'
import Spinner from './Spinner'

type Variant = 'primary' | 'secondary' | 'ghost' | 'outlineOnDark' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
  loading?: boolean
  href?: string
  children: ReactNode
}

function Button({
  variant = 'primary',
  size = 'md',
  fullWidth,
  loading,
  href,
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  const classes = [
    styles.button,
    styles[variant],
    size !== 'md' ? styles[size] : '',
    fullWidth ? styles.fullWidth : '',
    className || '',
  ]
    .filter(Boolean)
    .join(' ')

  const content = (
    <>
      {loading ? <Spinner size={16} color={variant === 'primary' ? '#fff' : 'currentColor'} /> : null}
      {children}
    </>
  )

  if (href) {
    return (
      <Link href={href} passHref>
        <a className={classes} style={{ textDecoration: 'none' }}>
          {content}
        </a>
      </Link>
    )
  }

  return (
    <button className={classes} disabled={disabled || loading} {...rest}>
      {content}
    </button>
  )
}

export default Button
