import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { PAQUETES } from '../../constants'
import TrackingBlock from './TrackingBlock'
import TechDataBlock from './TechDataBlock'
import FilesBlock from './FilesBlock'
import PackageMinutasBlock from './PackageMinutasBlock'

export default function PackageDrawer({ hospitalId, hospitalNombre, paqueteId, projectColor, userId, onClose }) {
  const [tracking, setTracking] = useState(undefined)
  const paquete = PAQUETES.find(p => p.id === paqueteId)

  useEffect(() => {
    loadTracking()
  }, [hospitalId, paqueteId])

  async function loadTracking() {
    setTracking(undefined)
    const { data } = await supabase
      .from('package_tracking')
      .select('*')
      .eq('hospital_id', hospitalId)
      .eq('paquete', paqueteId)
      .maybeSingle()
    setTracking(data || null)
  }

  async function upsertTracking(updates) {
    const { data } = await supabase
      .from('package_tracking')
      .upsert(
        { hospital_id: hospitalId, paquete: paqueteId, ...updates },
        { onConflict: 'hospital_id,paquete' }
      )
      .select()
      .single()
    setTracking(data)
    return data
  }

  // Crea (si no existe) el registro de seguimiento de forma silenciosa,
  // para poder adjuntar archivos o minutas sin obligar a llenar el bloque A o B.
  async function ensureTracking() {
    if (tracking) return tracking
    return await upsertTracking({})
  }

  return (
    <>
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 99 }}
      />
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: '100%', maxWidth: 560,
        background: '#111318', borderLeft: '1px solid #2D3139',
        zIndex: 100, overflowY: 'auto',
        fontFamily: "'Inter', sans-serif",
      }}>
        <div style={{
          background: '#1A1D23', borderBottom: '1px solid #2D3139',
          padding: '16px 20px', position: 'sticky', top: 0, zIndex: 1,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 11, color: projectColor, fontWeight: 700, marginBottom: 3, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {hospitalNombre}
              </div>
              <div style={{ fontSize: 17, fontWeight: 800, color: '#F9FAFB' }}>
                {paquete?.icon} {paquete?.labelFull}
              </div>
            </div>
            <button
              onClick={onClose}
              style={{ background: '#2D3139', border: 'none', borderRadius: 8, color: '#9CA3AF', cursor: 'pointer', fontSize: 16, padding: '6px 11px', marginLeft: 12 }}
            >
              ✕
            </button>
          </div>
        </div>

        {tracking === undefined ? (
          <div style={{ color: '#6B7280', fontSize: 14, textAlign: 'center', padding: 40 }}>Cargando...</div>
        ) : (
          <div style={{ padding: 20 }}>
            <TrackingBlock tracking={tracking} onSave={upsertTracking} />
            <TechDataBlock paquete={paquete} tracking={tracking} onSave={upsertTracking} />

            <FilesBlock
              trackingId={tracking?.id || null}
              ensureTracking={ensureTracking}
              hospitalId={hospitalId}
              paqueteId={paqueteId}
              userId={userId}
            />
            <PackageMinutasBlock trackingId={tracking?.id || null} ensureTracking={ensureTracking} />
          </div>
        )}
      </div>
    </>
  )
}
