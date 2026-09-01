import Link from 'next/link'
import { ReactNode } from 'react'
import Card from './ui/Card'
import Logo from './Logo'
import styles from './AuthLayout.module.css'

interface AuthLayoutProps {
  title: string
  subtitle?: string
  children: ReactNode
}

function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className={styles.page}>
      <Link href="/" passHref>
        <a className={styles.logoLink}>
          <Logo />
        </a>
      </Link>
      <div className={styles.cardWrap}>
        <Card padding="32px 28px">
          <h1 className={styles.title}>{title}</h1>
          {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
          {children}
        </Card>
      </div>
    </div>
  )
}

export default AuthLayout
export { styles as authLayoutStyles }
