import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import ProjectCard from '../components/ProjectCard'

// Paleta para asignar color a constructoras nuevas
const COLOR_PALETTE = ['#3DCD58', '#42B4E6', '#E47F00', '#8B5CF6', '#EC4899', '#008029', '#DC0A0A', '#00B2A9']

const NEW_INPUT = { width: '100%', background: '#FFFFFF', border: '1px solid #E0E0E0', borderRadius: 4, color: '#333333', padding: '8px 10px', fontSize: 13 }
const NEW_LABEL = { fontSize: 11, color: '#626469', fontWeight: 700, display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.5 }

export default function ProyectosTab({ refreshKey, userId, onOpenPackage }) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const firstLoad = useRef(true)

  // Formulario "Nuevo proyecto"
  const [showForm, setShowForm] = useState(false)
  const [constructoraSel, setConstructoraSel] = useState('__nueva__')
  const [nuevaConstructora, setNuevaConstructora] = useState('')
  const [nuevaRed, setNuevaRed] = useState('')
  const [nombreProyecto, setNombreProyecto] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    loadData({ silent: !firstLoad.current })
    firstLoad.current = false
  }, [refreshKey])

  async function loadData({ silent = false } = {}) {
    if (!silent) setLoading(true)
    const { data } = await supabase
      .from('projects')
      .select(`
        id, constructora, color, red, orden,
        hospitals (
          id, nombre, orden,
          offers (id, etapa, fecha_licitacion, fecha_entrega, notas),
          package_tracking (id, paquete),
          pendientes (id, texto, completado)
        )
      `)
      .order('orden')
      .order('orden', { referencedTable: 'hospitals' })
    setProjects(data || [])
    if (!silent) setLoading(false)
  }

  const allHospitals = projects.flatMap(p => p.hospitals || [])
  const adjudicados = allHospitals.filter(h => h.offers?.[0]?.etapa === 'Adjudicado').length
  const enProceso = allHospitals.filter(h =>
    ['En cotización', 'Oferta enviada', 'Negociación'].includes(h.offers?.[0]?.etapa)
  ).length
  const totalPendientes = allHospitals.reduce(
    (acc, h) => acc + (h.pendientes?.filter(p => !p.completado).length || 0), 0
  )

  async function updateOffer(hospitalId, updates) {
    await supabase
      .from('offers')
      .upsert({ hospital_id: hospitalId, ...updates }, { onConflict: 'hospital_id' })
    await loadData({ silent: true })
  }

  async function addPendiente(hospitalId, texto) {
    if (!texto.trim()) return
    await supabase.from('pendientes').insert({ hospital_id: hospitalId, texto: texto.trim() })
    await loadData({ silent: true })
  }

  async function completePendiente(id) {
    await supabase.from('pendientes').update({ completado: true }).eq('id', id)
    await loadData({ silent: true })
  }

  async function deleteProject(project) {
    if (!confirm(`¿Eliminar la constructora "${project.constructora}" y TODOS sus proyectos, paquetes y archivos? Esta acción no se puede deshacer.`)) return
    await supabase.from('projects').delete().eq('id', project.id)
    await loadData({ silent: true })
  }

  async function deleteHospital(hospital) {
    if (!confirm(`¿Eliminar el proyecto "${hospital.nombre}" con todos sus paquetes y archivos? Esta acción no se puede deshacer.`)) return
    await supabase.from('hospitals').delete().eq('id', hospital.id)
    await loadData({ silent: true })
  }

  function resetForm() {
    setConstructoraSel('__nueva__')
    setNuevaConstructora('')
    setNuevaRed('')
    setNombreProyecto('')
    setShowForm(false)
  }

  async function handleCreate() {
    const nombre = nombreProyecto.trim()
    if (!nombre) { alert('Escribe el nombre del proyecto.'); return }

    let projectId = constructoraSel
    if (constructoraSel === '__nueva__') {
      const nombreC = nuevaConstructora.trim()
      if (!nombreC) { alert('Escribe el nombre de la constructora / cliente.'); return }
      setCreating(true)
      const color = COLOR_PALETTE[projects.length % COLOR_PALETTE.length]
      const { data: proj, error } = await supabase
        .from('projects')
        .insert({
          user_id: userId,
          constructora: nombreC,
          red: nuevaRed.trim() || null,
          color,
          orden: projects.length + 1,
        })
        .select()
        .single()
      if (error || !proj) { setCreating(false); alert('No se pudo crear la constructora: ' + (error?.message || '')); return }
      projectId = proj.id
    } else {
      setCreating(true)
    }

    // orden del nuevo hospital dentro de su constructora
    const target = projects.find(p => p.id === projectId)
    const nextOrden = (target?.hospitals?.length || 0) + 1

    const { data: hosp, error: hErr } = await supabase
      .from('hospitals')
      .insert({ project_id: projectId, nombre, orden: nextOrden })
      .select()
      .single()

    if (hErr || !hosp) { setCreating(false); alert('No se pudo crear el proyecto: ' + (hErr?.message || '')); return }

    // offer inicial para que los upserts y stats funcionen
    await supabase.from('offers').insert({ hospital_id: hosp.id, etapa: 'Prospecto' })

    setCreating(false)
    resetForm()
    await loadData({ silent: true })
  }

  if (loading) {
    return <div style={{ color: '#626469', fontSize: 14, textAlign: 'center', padding: 40 }}>Cargando proyectos...</div>
  }

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
        {[
          { label: 'Adjudicados', value: adjudicados, color: '#008029' },
          { label: 'En proceso', value: enProceso, color: '#42B4E6' },
          { label: 'Pendientes', value: totalPendientes, color: '#E47F00' },
        ].map(s => (
          <div key={s.label} style={{ background: '#FFFFFF', border: '1px solid #E0E0E0', borderTop: `3px solid ${s.color}`, borderRadius: 8, padding: '12px 12px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#626469', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Crear nuevo proyecto */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          style={{ width: '100%', background: '#3DCD58', color: '#fff', border: 'none', borderRadius: 4, padding: '12px', fontSize: 14, fontWeight: 700, cursor: 'pointer', marginBottom: 16 }}
        >
          + Nuevo proyecto
        </button>
      ) : (
        <div style={{ background: '#FFFFFF', border: '1px solid #E0E0E0', borderRadius: 8, padding: 16, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#333333', marginBottom: 14 }}>Nuevo proyecto</div>

          <div style={{ marginBottom: 12 }}>
            <label style={NEW_LABEL}>Cliente / Constructora</label>
            <select value={constructoraSel} onChange={e => setConstructoraSel(e.target.value)} style={NEW_INPUT}>
              {projects.map(p => <option key={p.id} value={p.id}>{p.constructora}</option>)}
              <option value="__nueva__">+ Nueva constructora…</option>
            </select>
          </div>

          {constructoraSel === '__nueva__' && (
            <>
              <div style={{ marginBottom: 12 }}>
                <label style={NEW_LABEL}>Nombre de la constructora *</label>
                <input value={nuevaConstructora} onChange={e => setNuevaConstructora(e.target.value)} placeholder="Ej: Acciona" style={NEW_INPUT} />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={NEW_LABEL}>Red (opcional)</label>
                <input value={nuevaRed} onChange={e => setNuevaRed(e.target.value)} placeholder="Ej: Red del Biobío" style={NEW_INPUT} />
              </div>
            </>
          )}

          <div style={{ marginBottom: 14 }}>
            <label style={NEW_LABEL}>Nombre del proyecto *</label>
            <input value={nombreProyecto} onChange={e => setNombreProyecto(e.target.value)} placeholder="Ej: Hospital La Serena" style={NEW_INPUT} />
          </div>

          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button onClick={resetForm} disabled={creating} style={{ background: 'transparent', color: '#626469', border: '1px solid #E0E0E0', borderRadius: 4, padding: '8px 16px', fontSize: 13, cursor: 'pointer' }}>Cancelar</button>
            <button onClick={handleCreate} disabled={creating} style={{ background: '#3DCD58', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 18px', fontSize: 13, fontWeight: 700, cursor: creating ? 'wait' : 'pointer', opacity: creating ? 0.7 : 1 }}>
              {creating ? 'Creando…' : 'Crear proyecto'}
            </button>
          </div>
        </div>
      )}

      {projects.map(project => (
        <ProjectCard
          key={project.id}
          project={project}
          onUpdateOffer={updateOffer}
          onOpenPackage={onOpenPackage}
          onAddPendiente={addPendiente}
          onCompletePendiente={completePendiente}
          onDeleteProject={deleteProject}
          onDeleteHospital={deleteHospital}
        />
      ))}
    </>
  )
}
