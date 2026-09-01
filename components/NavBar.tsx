import type { CSSProperties } from 'react'

const iconButtonStyle: CSSProperties = {
  width: 40,
  height: 40,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'transparent',
  border: 'none',
  borderRadius: '50%',
  cursor: 'pointer',
  color: 'var(--color-text-secondary)',
  WebkitTapHighlightColor: 'transparent',
  transition: 'background-color 0.15s ease',
}

interface NavBarProps {
  title: string
  onBack?: () => void
  onLogout?: () => void
}

function NavBar({ title, onBack, onLogout }: NavBarProps) {
  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingTop: 'max(10px, env(safe-area-inset-top))',
        paddingBottom: 10,
        paddingLeft: 'max(10px, env(safe-area-inset-left))',
        paddingRight: 'max(10px, env(safe-area-inset-right))',
        backgroundColor: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div style={{ minWidth: 40, display: 'flex' }}>
        {onBack ? (
          <button aria-label="Volver" onClick={onBack} style={iconButtonStyle}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ) : null}
      </div>
      <span style={{ margin: 0, fontWeight: 700, fontSize: 17, color: 'var(--color-text)', textAlign: 'center' }}>{title}</span>
      <div style={{ minWidth: 40, display: 'flex', justifyContent: 'flex-end' }}>
        {onLogout ? (
          <button aria-label="Cerrar sesión" onClick={onLogout} style={iconButtonStyle}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="var(--color-error)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 17l5-5-5-5" stroke="var(--color-error)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M21 12H9" stroke="var(--color-error)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ) : null}
      </div>
    </div>
  )
}

export default NavBar
