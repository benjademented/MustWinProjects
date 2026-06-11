import { useState, useEffect } from 'react'
import { ESTADOS_PAQUETE } from '../../constants'

const INPUT = { width: '100%', background: '#111318', border: '1px solid #374151', borderRadius: 6, color: '#E5E7EB', padding: '7px 10px', fontSize: 13 }
const LABEL = { fontSize: 10, color: '#6B7280', fontWeight: 700, display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }
const FIELD = { marginBottom: 12 }

export default function TrackingBlock({ tracking, onSave }) {
  const [form, setForm] = useState({
    via_cotizacion: '',
    n_sr: '',
    n_quote: '',
    estado: 'Por solicitar',
    fecha_solicitud: '',
    fecha_recepcion: '',
    monto: '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (tracking) {
      setForm({
        via_cotizacion: tracking.via_cotizacion || '',
        n_sr: tracking.n_sr || '',
        n_quote: tracking.n_quote || '',
        estado: tracking.estado || 'Por solicitar',
        fecha_solicitud: tracking.fecha_solicitud || '',
        fecha_recepcion: tracking.fecha_recepcion || '',
        monto: tracking.monto ?? '',
      })
    }
  }, [tracking?.id])

  async function handleSave() {
    setSaving(true)
    await onSave({
      via_cotizacion: form.via_cotizacion || null,
      n_sr: form.n_sr || null,
      n_quote: form.n_quote || null,
      estado: form.estado,
      fecha_solicitud: form.fecha_solicitud || null,
      fecha_recepcion: form.fecha_recepcion || null,
      monto: form.monto !== '' ? Number(form.monto) : null,
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function f(field, value) { setForm(prev => ({ ...prev, [field]: value })) }

  return (
    <div style={{ background: '#1A1D23', border: '1px solid #2D3139', borderRadius: 12, padding: 16, marginBottom: 12 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', marginBottom: 14, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        A · Seguimiento
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={LABEL}>Vía de cotización</label>
        <div style={{ display: 'flex', gap: 8 }}>
          {['SR', 'Quote'].map(opt => (
            <button
              key={opt}
              onClick={() => f('via_cotizacion', form.via_cotizacion === opt ? '' : opt)}
              style={{
                background: form.via_cotizacion === opt ? '#00B2A933' : '#111318',
                color: form.via_cotizacion === opt ? '#00B2A9' : '#6B7280',
                border: `1px solid ${form.via_cotizacion === opt ? '#00B2A9' : '#374151'}`,
                borderRadius: 6, padding: '5px 16px', fontSize: 13, cursor: 'pointer', fontWeight: 600,
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {(form.via_cotizacion === 'SR' || !form.via_cotizacion) && (
        <div style={FIELD}>
          <label style={LABEL}>N° SR</label>
          <input value={form.n_sr} onChange={e => f('n_sr', e.target.value)} placeholder="SR-XXXXXXX" style={INPUT} />
        </div>
      )}

      {(form.via_cotizacion === 'Quote' || !form.via_cotizacion) && (
        <div style={FIELD}>
          <label style={LABEL}>N° Quote / CPQ</label>
          <input value={form.n_quote} onChange={e => f('n_quote', e.target.value)} placeholder="CPQ-XXXX" style={INPUT} />
        </div>
      )}

      <div style={FIELD}>
        <label style={LABEL}>Estado</label>
        <select value={form.estado} onChange={e => f('estado', e.target.value)} style={INPUT}>
          {ESTADOS_PAQUETE.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
        <div>
          <label style={LABEL}>Fecha solicitud</label>
          <input type="date" value={form.fecha_solicitud} onChange={e => f('fecha_solicitud', e.target.value)} style={INPUT} />
        </div>
        <div>
          <label style={LABEL}>Fecha recepción oferta</label>
          <input type="date" value={form.fecha_recepcion} onChange={e => f('fecha_recepcion', e.target.value)} style={INPUT} />
        </div>
      </div>

      <div style={FIELD}>
        <label style={LABEL}>Monto oferta (CLP)</label>
        <input
          type="number"
          value={form.monto}
          onChange={e => f('monto', e.target.value)}
          placeholder="0"
          style={INPUT}
        />
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
        {saving ? 'Guardando...' : saved ? '✓ Guardado' : 'Guardar seguimiento'}
      </button>
    </div>
  )
}
