import { ETAPA_COLOR } from '../constants'

export default function Badge({ etapa }) {
  const color = ETAPA_COLOR[etapa] || '#6B7280'
  return (
    <span style={{
      background: color + '22',
      color,
      border: `1px solid ${color}44`,
      borderRadius: 6,
      padding: '2px 10px',
      fontSize: 11,
      fontWeight: 700,
    }}>
      {etapa}
    </span>
  )
}
