import { Text } from '@nextui-org/react'

const iconButtonStyle = {
    width: 44,
    height: 44,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'transparent',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    color: '#5e5e5e',
    WebkitTapHighlightColor: 'transparent',
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
                paddingTop: 'max(6px, env(safe-area-inset-top))',
                paddingBottom: 6,
                paddingLeft: 'max(8px, env(safe-area-inset-left))',
                paddingRight: 'max(8px, env(safe-area-inset-right))',
                backgroundColor: '#fff',
                borderBottom: '1px solid #ececec',
                boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
            }}
        >
            <div style={{ minWidth: 44, display: 'flex' }}>
                {onBack ? (
                    <button aria-label="Volver" onClick={onBack} style={iconButtonStyle}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                ) : null}
            </div>
            <Text h4 style={{ margin: 0, fontWeight: 600, color: '#333', textAlign: 'center' }}>{title}</Text>
            <div style={{ minWidth: 44, display: 'flex', justifyContent: 'flex-end' }}>
                {onLogout ? (
                    <button aria-label="Cerrar sesión" onClick={onLogout} style={iconButtonStyle}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="#f21361" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M16 17l5-5-5-5" stroke="#f21361" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M21 12H9" stroke="#f21361" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                ) : null}
            </div>
        </div>
    )
}

export default NavBar
