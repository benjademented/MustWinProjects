import { useState, useEffect } from 'react'

const INPUT = { width: '100%', background: '#111318', border: '1px solid #374151', borderRadius: 6, color: '#E5E7EB', padding: '7px 10px', fontSize: 13 }
const LABEL = { fontSize: 10, color: '#6B7280', fontWeight: 700, display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }

export default function TechDataBlock({ paquete, tracking, onSave }) {
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setForm(tracking?.datos_tecnicos || {})
  }, [tracking?.id])

  if (!paquete?.fields?.length) return null

  async function handleSave() {
    setSaving(true)
    await onSave({ datos_tecnicos: form })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={{ background: '#1A1D23', border: '1px solid #2D3139', borderRadius: 12, padding: 16, marginBottom: 12 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', marginBottom: 14, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        B · Datos técnicos
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
        {paquete.fields.map(field => (
          <div key={field.key}>
            <label style={LABEL}>{field.label}</label>
            {field.type === 'select' ? (
              <select
                value={form[field.key] || ''}
                onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                style={INPUT}
              >
                <option value="">-- Seleccionar --</option>
                {field.options.map(o => <option key={o}>{o}</option>)}
              </select>
            ) : (
              <input
                type={field.type === 'number' ? 'number' : 'text'}
                value={form[field.key] ?? ''}
                onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                placeholder={field.type === 'number' ? '0' : ''}
                style={INPUT}
              />
            )}
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        style={{
          background: saved ? '#10B981' : '#00B2A9',
          color: '#fff', border: 'none', borderRadius: 7,
          padding: '8px 18px', fontSize: 13, fontWeight: 700,
          cursor: saving ? 'wait' : 'pointer', opacity: saving ? 0.7 : 1,
        }}
      >
        {saving ? 'Guardando...' : saved ? '✓ Guardado' : 'Guardar datos técnicos'}
      </button>
    </div>
  )
}
