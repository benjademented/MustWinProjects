import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { PAQUETES } from '../../constants'
import TrackingBlock from './TrackingBlock'
import TechDataBlock from './TechDataBlock'
import FilesBlock from './FilesBlock'
import PackageMinutasBlock from './PackageMinutasBlock'

const SE = "'Nunito', -apple-system, 'Segoe UI', Arial, sans-serif"

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

  async function ensureTracking() {
    if (tracking) return tracking
    return await upsertTracking({})
  }

  return (
    <>
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 99 }}
      />
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: '100%', maxWidth: 560,
        background: '#F9F9F9', borderLeft: '1px solid #E0E0E0',
        zIndex: 100, overflowY: 'auto',
        fontFamily: SE,
        boxShadow: '-4px 0 24px rgba(0,0,0,0.10)',
      }}>
        <div style={{
          background: '#FFFFFF', borderBottom: '1px solid #E0E0E0',
          padding: '16px 20px', position: 'sticky', top: 0, zIndex: 1,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 11, color: projectColor, fontWeight: 700, marginBottom: 3, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {hospitalNombre}
              </div>
              <div style={{ fontSize: 17, fontWeight: 800, color: '#333333' }}>
                {paquete?.icon} {paquete?.labelFull}
              </div>
            </div>
            <button
              onClick={onClose}
              style={{ background: '#F9F9F9', border: '1px solid #E0E0E0', borderRadius: 4, color: '#626469', cursor: 'pointer', fontSize: 16, padding: '6px 11px', marginLeft: 12 }}
            >
              ✕
            </button>
          </div>
        </div>

        {tracking === undefined ? (
          <div style={{ color: '#626469', fontSize: 14, textAlign: 'center', padding: 40 }}>Cargando...</div>
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
