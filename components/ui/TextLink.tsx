import Link from 'next/link'
import { AnchorHTMLAttributes, ReactNode } from 'react'

interface TextLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  children: ReactNode
}

function TextLink({ href, children, style, ...rest }: TextLinkProps) {
  return (
    <Link href={href} passHref>
      <a style={{ fontWeight: 600, color: 'var(--color-primary-text)', ...style }} {...rest}>
        {children}
      </a>
    </Link>
  )
}

export default TextLink
