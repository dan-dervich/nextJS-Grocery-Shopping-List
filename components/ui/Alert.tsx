import { ReactNode } from 'react'

type Variant = 'error' | 'success' | 'info'

const styles: Record<Variant, { bg: string; color: string; icon: ReactNode }> = {
  error: {
    bg: 'var(--color-error-tint)',
    color: 'var(--color-error)',
    icon: (
      <path d="M12 8v5M12 16h.01M10.3 3.6 2 18a1.5 1.5 0 0 0 1.3 2.2h17.4A1.5 1.5 0 0 0 22 18L13.7 3.6a1.5 1.5 0 0 0-2.6 0Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  success: {
    bg: 'var(--color-success-tint)',
    color: 'var(--color-success)',
    icon: <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />,
  },
  info: {
    bg: 'var(--color-primary-tint)',
    color: 'var(--color-primary-text)',
    icon: (
      <>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
        <path d="M12 11v5M12 8h.01" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </>
    ),
  },
}

interface AlertProps {
  variant?: Variant
  children: ReactNode
  onClose?: () => void
}

function Alert({ variant = 'info', children, onClose }: AlertProps) {
  const s = styles[variant]
  return (
    <div
      role="alert"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        background: s.bg,
        color: s.color,
        borderRadius: 'var(--radius-sm)',
        padding: '12px 14px',
        fontSize: 14,
        lineHeight: 1.45,
        width: '100%',
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
        {s.icon}
      </svg>
      <span style={{ flex: 1 }}>{children}</span>
      {onClose ? (
        <button
          onClick={onClose}
          aria-label="Cerrar"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: s.color, opacity: 0.7, padding: 0, lineHeight: 1 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      ) : null}
    </div>
  )
}

export default Alert
