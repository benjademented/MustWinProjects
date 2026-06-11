import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Badge from '../components/Badge'

export default function ResumenTab({ refreshKey }) {
  const [projects, setProjects] = useState(null)

  useEffect(() => { loadData() }, [refreshKey])

  async function loadData() {
    const { data } = await supabase
      .from('projects')
      .select(`
        id, constructora, color, red,
        hospitals (
          id, nombre,
          offers (etapa),
          package_tracking (id),
          pendientes (id, texto, completado)
        )
      `)
      .order('orden')
    setProjects(data || [])
  }

  if (!projects) return <div style={{ color: '#626469', fontSize: 14, textAlign: 'center', padding: 40 }}>Cargando...</div>

  const allHospitals = projects.flatMap(p => p.hospitals || [])
  const adjudicados = allHospitals.filter(h => h.offers?.[0]?.etapa === 'Adjudicado').length
  const activePaquetes = allHospitals.reduce((acc, h) => acc + (h.package_tracking?.length || 0), 0)
  const totalPendientes = allHospitals.reduce(
    (acc, h) => acc + (h.pendientes?.filter(p => !p.completado).length || 0), 0
  )

  const stats = [
    { label: 'Constructoras', value: projects.length, color: '#42B4E6' },
    { label: 'Hospitales totales', value: allHospitals.length, color: '#3DCD58' },
    { label: 'Adjudicados', value: adjudicados, color: '#008029' },
    { label: 'Paquetes activos', value: activePaquetes, color: '#8B5CF6' },
    { label: 'Pendientes abiertos', value: totalPendientes, color: '#E47F00' },
  ]

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: '#FFFFFF', border: '1px solid #E0E0E0', borderTop: `3px solid ${s.color}`, borderRadius: 8, padding: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#626469', marginTop: 3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 11, color: '#626469', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700 }}>Estado por proyecto</div>
      {projects.map(p => (
        <div key={p.id} style={{ background: '#FFFFFF', borderLeft: `4px solid ${p.color}`, border: '1px solid #E0E0E0', borderRadius: 8, padding: '12px 14px', marginBottom: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ fontWeight: 700, color: '#333333', marginBottom: 8, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            {p.constructora}
            {p.red && <span style={{ fontSize: 10, color: p.color, background: p.color + '18', borderRadius: 4, padding: '2px 7px', fontWeight: 700 }}>{p.red}</span>}
          </div>
          {(p.hospitals || []).map(h => (
            <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #F0F0F0' }}>
              <span style={{ fontSize: 13, color: '#626469' }}>🏥 {h.nombre}</span>
              <Badge etapa={h.offers?.[0]?.etapa || 'Prospecto'} />
            </div>
          ))}
        </div>
      ))}

      {totalPendientes > 0 && (
        <>
          <div style={{ fontSize: 11, color: '#626469', margin: '20px 0 10px', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700 }}>Todos los pendientes</div>
          {projects.map(p => {
            const items = (p.hospitals || []).flatMap(h =>
              (h.pendientes || [])
                .filter(pd => !pd.completado)
                .map(pd => ({ hospitalNombre: h.nombre, ...pd }))
            )
            if (items.length === 0) return null
            return (
              <div key={p.id} style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 12, color: p.color, fontWeight: 700, marginBottom: 6 }}>{p.constructora}</div>
                {items.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: 8, marginBottom: 5, alignItems: 'flex-start' }}>
                    <span style={{ color: '#E47F00', fontSize: 12 }}>→</span>
                    <div>
                      <div style={{ fontSize: 13, color: '#333333' }}>{item.texto}</div>
                      <div style={{ fontSize: 11, color: '#626469' }}>{item.hospitalNombre}</div>
                    </div>
                  </div>
                ))}
              </div>
            )
          })}
        </>
      )}
    </div>
  )
}
