const PALETTE = ['#c7811f', '#2f7d4f', '#3d6ea5', '#a4477a', '#b3532c', '#5a6ac1', '#3f8f8f']

export function colorForName(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return PALETTE[Math.abs(hash) % PALETTE.length]
}

interface AvatarProps {
  name: string
  size?: number
  onClick?: () => void
}

function Avatar({ name, size = 76, onClick }: AvatarProps) {
  const initial = name.trim().slice(0, 1).toUpperCase() || '?'
  const Tag: any = onClick ? 'button' : 'div'
  return (
    <Tag
      onClick={onClick}
      aria-label={onClick ? name : undefined}
      style={{
        width: size,
        height: size,
        borderRadius: 'var(--radius-lg)',
        background: colorForName(name),
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.42,
        fontWeight: 700,
        border: 'none',
        cursor: onClick ? 'pointer' : 'default',
        boxShadow: 'var(--shadow-sm)',
        transition: 'transform 0.12s ease, box-shadow 0.15s ease',
      }}
      onMouseDown={(e: any) => onClick && (e.currentTarget.style.transform = 'scale(0.95)')}
      onMouseUp={(e: any) => onClick && (e.currentTarget.style.transform = 'scale(1)')}
    >
      {initial}
    </Tag>
  )
}

export default Avatar
