import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const INPUT = { width: '100%', background: '#FFFFFF', border: '1px solid #E0E0E0', borderRadius: 4, color: '#333333', padding: '8px 10px', fontSize: 13 }
const LABEL = { fontSize: 11, color: '#626469', fontWeight: 700, display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.5 }

function today() { return new Date().toISOString().split('T')[0] }

function fmtDate(d) {
  if (!d) return ''
  const [y, m, day] = d.split('-')
  return `${day}/${m}/${y}`
}

export default function MinutasTab({ userId, onMinutasChange }) {
  const [minutas, setMinutas] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ fecha: today(), resumen: '', transcripcion: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadData() }, [])

  async function loadData() {
    const { data } = await supabase
      .from('minutas')
      .select('*')
      .order('fecha', { ascending: false })
      .order('created_at', { ascending: false })
    setMinutas(data || [])
    setLoading(false)
  }

  async function handleSave() {
    if (!form.resumen.trim()) return
    setSaving(true)
    await supabase.from('minutas').insert({ user_id: userId, ...form })
    await loadData()
    onMinutasChange()
    setForm({ fecha: today(), resumen: '', transcripcion: '' })
    setShowForm(false)
    setSaving(false)
  }

  async function handleDelete(id) {
    if (!confirm('¿Eliminar esta minuta?')) return
    await supabase.from('minutas').delete().eq('id', id)
    await loadData()
    onMinutasChange()
  }

  if (loading) return <div style={{ color: '#626469', fontSize: 14, textAlign: 'center', padding: 40 }}>Cargando...</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ color: '#626469', fontSize: 13 }}>Reuniones y llamadas de seguimiento</div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{ background: '#3DCD58', color: '#fff', border: 'none', borderRadius: 4, padding: '7px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
        >
          + Nueva minuta
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#FFFFFF', border: '1px solid #3DCD58', borderRadius: 8, padding: 16, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ marginBottom: 12 }}>
            <label style={LABEL}>Fecha</label>
            <input type="date" value={form.fecha} onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))} style={INPUT} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={LABEL}>Resumen *</label>
            <input
              value={form.resumen}
              onChange={e => setForm(f => ({ ...f, resumen: e.target.value }))}
              placeholder="Resumen breve de la reunión..."
              style={INPUT}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={LABEL}>Texto completo (opcional)</label>
            <textarea
              value={form.transcripcion}
              onChange={e => setForm(f => ({ ...f, transcripcion: e.target.value }))}
              rows={4}
              placeholder="Notas detalladas..."
              style={{ ...INPUT, resize: 'vertical' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button
              onClick={() => setShowForm(false)}
              style={{ background: 'transparent', color: '#626469', border: '1px solid #E0E0E0', borderRadius: 4, padding: '7px 16px', fontSize: 13, cursor: 'pointer' }}
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !form.resumen.trim()}
              style={{ background: '#3DCD58', color: '#fff', border: 'none', borderRadius: 4, padding: '7px 18px', fontSize: 13, fontWeight: 700, cursor: saving ? 'wait' : 'pointer', opacity: (saving || !form.resumen.trim()) ? 0.6 : 1 }}
            >
              {saving ? 'Guardando...' : 'Guardar minuta'}
            </button>
          </div>
        </div>
      )}

      {minutas.map((m, i) => (
        <div key={m.id} style={{ background: '#FFFFFF', border: '1px solid #E0E0E0', borderRadius: 8, padding: 16, marginBottom: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'flex-start' }}>
            <span style={{ fontWeight: 700, color: '#333333', fontSize: 14 }}>Minuta #{minutas.length - i}</span>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: '#626469' }}>{fmtDate(m.fecha)}</span>
              <button
                onClick={() => handleDelete(m.id)}
                title="Eliminar"
                style={{ background: 'none', border: 'none', color: '#C0C0C0', cursor: 'pointer', fontSize: 14, lineHeight: 1 }}
              >
                ✕
              </button>
            </div>
          </div>
          <div style={{ fontSize: 13, color: '#333333', background: '#F9F9F9', borderRadius: 4, padding: '10px 12px', lineHeight: 1.6 }}>
            {m.resumen}
          </div>
          {m.transcripcion && (
            <details style={{ marginTop: 8 }}>
              <summary style={{ fontSize: 12, color: '#008029', cursor: 'pointer' }}>Ver texto completo →</summary>
              <div style={{ fontSize: 13, color: '#626469', marginTop: 8, lineHeight: 1.7, padding: '0 4px' }}>{m.transcripcion}</div>
            </details>
          )}
        </div>
      ))}

      {minutas.length === 0 && !showForm && (
        <div style={{ color: '#626469', fontSize: 13, textAlign: 'center', padding: 48, background: '#FFFFFF', borderRadius: 8, border: '1px solid #E0E0E0' }}>
          Sin minutas todavía. Usa el botón para agregar la primera.
        </div>
      )}
    </div>
  )
}
