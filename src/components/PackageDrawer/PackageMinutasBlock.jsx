import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

const INPUT = { width: '100%', background: '#111318', border: '1px solid #374151', borderRadius: 6, color: '#E5E7EB', padding: '7px 10px', fontSize: 13 }
const LABEL = { fontSize: 10, color: '#6B7280', fontWeight: 700, display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }

function today() { return new Date().toISOString().split('T')[0] }

function fmtDate(d) {
  if (!d) return ''
  const [y, m, day] = d.split('-')
  return `${day}/${m}/${y}`
}

export default function PackageMinutasBlock({ trackingId, ensureTracking }) {
  const [minutas, setMinutas] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ fecha: today(), texto: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (trackingId) loadMinutas(trackingId)
    else setMinutas([])
  }, [trackingId])

  async function loadMinutas(id = trackingId) {
    if (!id) return
    const { data } = await supabase
      .from('package_minutas')
      .select('*')
      .eq('package_tracking_id', id)
      .order('fecha', { ascending: false })
      .order('created_at', { ascending: false })
    setMinutas(data || [])
  }

  async function handleSave() {
    if (!form.texto.trim()) return
    setSaving(true)
    // Crea el registro de seguimiento si aún no existe
    let tid = trackingId
    if (!tid) {
      const t = await ensureTracking()
      tid = t?.id
    }
    if (!tid) { setSaving(false); alert('No se pudo crear el registro del paquete.'); return }
    await supabase.from('package_minutas').insert({
      package_tracking_id: tid,
      fecha: form.fecha,
      texto: form.texto.trim(),
    })
    await loadMinutas(tid)
    setForm({ fecha: today(), texto: '' })
    setShowForm(false)
    setSaving(false)
  }

  async function handleDelete(id) {
    if (!confirm('¿Eliminar esta minuta?')) return
    await supabase.from('package_minutas').delete().eq('id', id)
    await loadMinutas()
  }

  return (
    <div style={{ background: '#1A1D23', border: '1px solid #2D3139', borderRadius: 12, padding: 16, marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.5 }}>
          D · Minutas del paquete
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{ background: '#2D3139', color: '#9CA3AF', border: 'none', borderRadius: 6, padding: '5px 12px', fontSize: 12, cursor: 'pointer' }}
        >
          + Nueva
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#111318', border: '1px solid #374151', borderRadius: 8, padding: 12, marginBottom: 12 }}>
          <div style={{ marginBottom: 10 }}>
            <label style={LABEL}>Fecha</label>
            <input type="date" value={form.fecha} onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))} style={INPUT} />
          </div>
          <div style={{ marginBottom: 10 }}>
            <label style={LABEL}>Nota *</label>
            <textarea
              value={form.texto}
              onChange={e => setForm(f => ({ ...f, texto: e.target.value }))}
              rows={3}
              placeholder="Ej: Llamé a media tensión, confirman entrega el viernes..."
              style={{ ...INPUT, resize: 'vertical' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button onClick={() => setShowForm(false)} style={{ background: 'transparent', color: '#6B7280', border: '1px solid #374151', borderRadius: 6, padding: '5px 12px', fontSize: 12, cursor: 'pointer' }}>Cancelar</button>
            <button
              onClick={handleSave}
              disabled={saving || !form.texto.trim()}
              style={{ background: '#00B2A9', color: '#fff', border: 'none', borderRadius: 6, padding: '5px 14px', fontSize: 12, fontWeight: 700, cursor: saving ? 'wait' : 'pointer', opacity: (saving || !form.texto.trim()) ? 0.6 : 1 }}
            >
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      )}

      {minutas.length === 0 && !showForm ? (
        <div style={{ color: '#4B5563', fontSize: 13, textAlign: 'center', padding: '16px 0' }}>
          Sin minutas para este paquete.
        </div>
      ) : (
        minutas.map(m => (
          <div key={m.id} style={{ padding: '10px 0', borderBottom: '1px solid #2D3139' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: '#6B7280' }}>{fmtDate(m.fecha)}</span>
              <button onClick={() => handleDelete(m.id)} title="Eliminar" style={{ background: 'none', border: 'none', color: '#4B5563', cursor: 'pointer', fontSize: 13 }}>✕</button>
            </div>
            <div style={{ fontSize: 13, color: '#D1D5DB', lineHeight: 1.6 }}>{m.texto}</div>
          </div>
        ))
      )}
    </div>
  )
}
