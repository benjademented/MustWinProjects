import { useState, useEffect } from 'react'

const INPUT = { width: '100%', background: '#FFFFFF', border: '1px solid #E0E0E0', borderRadius: 4, color: '#333333', padding: '7px 10px', fontSize: 13 }
const LABEL = { fontSize: 11, color: '#626469', fontWeight: 700, display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.5 }

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
    <div style={{ background: '#FFFFFF', border: '1px solid #E0E0E0', borderRadius: 8, padding: 16, marginBottom: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#626469', marginBottom: 14, textTransform: 'uppercase', letterSpacing: 0.5 }}>
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
          background: saved ? '#008029' : '#3DCD58',
          color: '#fff', border: 'none', borderRadius: 4,
          padding: '8px 20px', fontSize: 13, fontWeight: 700,
          cursor: saving ? 'wait' : 'pointer', opacity: saving ? 0.7 : 1,
          transition: 'background 0.2s',
        }}
      >
        {saving ? 'Guardando...' : saved ? '✓ Guardado' : 'Guardar datos técnicos'}
      </button>
    </div>
  )
}
