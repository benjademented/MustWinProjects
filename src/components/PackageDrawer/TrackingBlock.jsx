import { useState, useEffect } from 'react'
import { ESTADOS_PAQUETE } from '../../constants'

const INPUT = { width: '100%', background: '#FFFFFF', border: '1px solid #E0E0E0', borderRadius: 4, color: '#333333', padding: '7px 10px', fontSize: 13 }
const LABEL = { fontSize: 11, color: '#626469', fontWeight: 700, display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.5 }
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
    <div style={{ background: '#FFFFFF', border: '1px solid #E0E0E0', borderRadius: 8, padding: 16, marginBottom: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#626469', marginBottom: 14, textTransform: 'uppercase', letterSpacing: 0.5 }}>
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
                background: form.via_cotizacion === opt ? 'rgba(61,205,88,0.12)' : '#F9F9F9',
                color: form.via_cotizacion === opt ? '#008029' : '#626469',
                border: `1px solid ${form.via_cotizacion === opt ? '#3DCD58' : '#E0E0E0'}`,
                borderRadius: 4, padding: '5px 18px', fontSize: 13, cursor: 'pointer', fontWeight: 600,
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
          background: saved ? '#008029' : '#3DCD58',
          color: '#fff', border: 'none', borderRadius: 4,
          padding: '8px 20px', fontSize: 13, fontWeight: 700,
          cursor: saving ? 'wait' : 'pointer', opacity: saving ? 0.7 : 1,
          transition: 'background 0.2s',
        }}
      >
        {saving ? 'Guardando...' : saved ? '✓ Guardado' : 'Guardar seguimiento'}
      </button>
    </div>
  )
}
