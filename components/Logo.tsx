interface LogoProps {
  size?: number
  light?: boolean
}

function Logo({ size = 26, light = false }: LogoProps) {
  const color = light ? '#fff' : 'var(--color-primary)'
  const textColor = light ? '#fff' : 'var(--color-text)'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect x="1.5" y="1.5" width="21" height="21" rx="7" stroke={color} strokeWidth="1.8" />
        <path d="M7 12.5 10.3 16 17 8" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span style={{ fontWeight: 800, fontSize: size * 0.72, color: textColor, letterSpacing: '-0.02em' }}>Listo</span>
    </div>
  )
}

export default Logo
