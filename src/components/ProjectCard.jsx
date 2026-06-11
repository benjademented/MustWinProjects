import { useState, useEffect } from 'react'
import { PAQUETES, ETAPAS } from '../constants'
import Badge from './Badge'

const INPUT = { background: '#FFFFFF', border: '1px solid #E0E0E0', borderRadius: 4, color: '#333333', padding: '4px 8px', fontSize: 12 }
const DEL_BTN = { background: 'transparent', color: '#DC0A0A', border: '1px solid rgba(220,10,10,0.25)', borderRadius: 4, padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', width: '100%' }

function HospitalRow({ hospital, projectColor, onUpdateOffer, onOpenPackage, onAddPendiente, onCompletePendiente, onDeleteHospital }) {
  const [form, setForm] = useState({
    etapa: 'Prospecto',
    fecha_licitacion: '',
    fecha_entrega: '',
    notas: '',
  })
  const [newPendiente, setNewPendiente] = useState('')

  useEffect(() => {
    const o = hospital.offers?.[0] || {}
    setForm({
      etapa: o.etapa || 'Prospecto',
      fecha_licitacion: o.fecha_licitacion || '',
      fecha_entrega: o.fecha_entrega || '',
      notas: o.notas || '',
    })
  }, [hospital.id])

  const activePackages = new Set((hospital.package_tracking || []).map(pt => pt.paquete))
  const activePendientes = (hospital.pendientes || []).filter(p => !p.completado)

  function saveField(field, value) {
    onUpdateOffer(hospital.id, { [field]: value })
  }

  function handleAddPendiente() {
    if (!newPendiente.trim()) return
    onAddPendiente(hospital.id, newPendiente)
    setNewPendiente('')
  }

  return (
    <div style={{ padding: '16px 18px', borderTop: '1px solid #E0E0E0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
        <span style={{ fontWeight: 700, color: '#333333', fontSize: 14 }}>🏥 {hospital.nombre}</span>
        <Badge etapa={form.etapa} />
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 10, color: '#626469', marginBottom: 3, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.4 }}>Licitación</div>
          <input
            type="date"
            value={form.fecha_licitacion}
            onChange={e => { const v = e.target.value; setForm(f => ({ ...f, fecha_licitacion: v })); saveField('fecha_licitacion', v) }}
            style={{ ...INPUT, width: 140 }}
          />
        </div>
        <div>
          <div style={{ fontSize: 10, color: '#626469', marginBottom: 3, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.4 }}>Entrega oferta</div>
          <input
            type="date"
            value={form.fecha_entrega}
            onChange={e => { const v = e.target.value; setForm(f => ({ ...f, fecha_entrega: v })); saveField('fecha_entrega', v) }}
            style={{ ...INPUT, width: 140 }}
          />
        </div>
        <div>
          <div style={{ fontSize: 10, color: '#626469', marginBottom: 3, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.4 }}>Etapa</div>
          <select
            value={form.etapa}
            onChange={e => { const v = e.target.value; setForm(f => ({ ...f, etapa: v })); saveField('etapa', v) }}
            style={INPUT}
          >
            {ETAPAS.map(e => <option key={e}>{e}</option>)}
          </select>
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 10, color: '#626469', marginBottom: 6, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.4 }}>Paquetes</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {PAQUETES.map(p => {
            const active = activePackages.has(p.id)
            return (
              <button
                key={p.id}
                onClick={() => onOpenPackage({ hospitalId: hospital.id, hospitalNombre: hospital.nombre, paqueteId: p.id, projectColor })}
                title={p.labelFull}
                style={{
                  background: active ? projectColor + '18' : '#F9F9F9',
                  color: active ? projectColor : '#626469',
                  border: `1px solid ${active ? projectColor : '#E0E0E0'}`,
                  borderRadius: 4, padding: '3px 9px', fontSize: 11,
                  cursor: 'pointer', fontWeight: active ? 700 : 400,
                  transition: 'all 0.12s',
                }}
              >
                {p.icon} {p.label}
              </button>
            )
          })}
        </div>
      </div>

      {activePendientes.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 10, color: '#626469', marginBottom: 5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.4 }}>Pendientes</div>
          {activePendientes.map(p => (
            <div key={p.id} style={{ display: 'flex', gap: 6, marginBottom: 4, alignItems: 'flex-start' }}>
              <button
                onClick={() => onCompletePendiente(p.id)}
                title="Marcar completado"
                style={{ background: 'none', border: '1px solid #E0E0E0', borderRadius: 4, color: '#626469', cursor: 'pointer', fontSize: 9, padding: '2px 5px', marginTop: 2, flexShrink: 0 }}
              >
                ✓
              </button>
              <span style={{ fontSize: 12, color: '#333333', lineHeight: 1.5 }}>{p.texto}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
        <input
          value={newPendiente}
          onChange={e => setNewPendiente(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleAddPendiente() }}
          placeholder="Agregar pendiente..."
          style={{ flex: 1, background: '#FFFFFF', border: '1px solid #E0E0E0', borderRadius: 4, color: '#626469', padding: '5px 8px', fontSize: 12 }}
        />
        <button
          onClick={handleAddPendiente}
          style={{ background: '#F9F9F9', border: '1px solid #E0E0E0', borderRadius: 4, color: '#626469', cursor: 'pointer', fontSize: 14, padding: '4px 12px' }}
        >
          +
        </button>
      </div>

      <textarea
        value={form.notas}
        onChange={e => setForm(f => ({ ...f, notas: e.target.value }))}
        onBlur={() => saveField('notas', form.notas)}
        placeholder="Notas del proyecto..."
        rows={2}
        style={{ width: '100%', background: '#FFFFFF', border: '1px solid #E0E0E0', borderRadius: 4, color: '#626469', padding: '6px 8px', fontSize: 12, resize: 'vertical', marginBottom: 12 }}
      />

      <button onClick={() => onDeleteHospital(hospital)} style={DEL_BTN}>
        Eliminar proyecto "{hospital.nombre}"
      </button>
    </div>
  )
}

export default function ProjectCard({ project, onUpdateOffer, onOpenPackage, onAddPendiente, onCompletePendiente, onDeleteProject, onDeleteHospital }) {
  const [expanded, setExpanded] = useState(false)
  const hospitals = project.hospitals || []
  const etapasLabel = [...new Set(hospitals.map(h => h.offers?.[0]?.etapa).filter(Boolean))].join(', ') || 'Sin etapa'

  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #E0E0E0', borderRadius: 8, overflow: 'hidden', marginBottom: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
      <div
        onClick={() => setExpanded(!expanded)}
        style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', borderLeft: `4px solid ${project.color}` }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 800, fontSize: 15, color: '#333333' }}>{project.constructora}</span>
            {project.red && (
              <span style={{ fontSize: 10, color: project.color, background: project.color + '18', borderRadius: 4, padding: '2px 7px', fontWeight: 700 }}>{project.red}</span>
            )}
          </div>
          <div style={{ fontSize: 12, color: '#626469', marginTop: 2 }}>
            {hospitals.length} proyecto{hospitals.length !== 1 ? 's' : ''} · {etapasLabel}
          </div>
        </div>
        <span style={{ color: '#626469', fontSize: 12 }}>{expanded ? '▲' : '▼'}</span>
      </div>

      {expanded && (
        <>
          {hospitals.map(hospital => (
            <HospitalRow
              key={hospital.id}
              hospital={hospital}
              projectColor={project.color}
              onUpdateOffer={onUpdateOffer}
              onOpenPackage={onOpenPackage}
              onAddPendiente={onAddPendiente}
              onCompletePendiente={onCompletePendiente}
              onDeleteHospital={onDeleteHospital}
            />
          ))}
          <div style={{ padding: '12px 18px', borderTop: '1px solid #E0E0E0', background: '#F9F9F9' }}>
            <button onClick={() => onDeleteProject(project)} style={DEL_BTN}>
              Eliminar constructora "{project.constructora}" y todos sus proyectos
            </button>
          </div>
        </>
      )}
    </div>
  )
}
