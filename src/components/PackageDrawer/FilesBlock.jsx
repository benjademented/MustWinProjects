import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabase'

const MAX_SIZE_MB = 15
const ALLOWED_TYPES = ['application/pdf', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
const ALLOWED_EXT = ['.pdf', '.xls', '.xlsx']

function fmtDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function fileIcon(tipo) {
  if (tipo?.includes('pdf')) return '📄'
  if (tipo?.includes('excel') || tipo?.includes('spreadsheet') || tipo === 'xls' || tipo === 'xlsx') return '📊'
  return '📎'
}

export default function FilesBlock({ trackingId, ensureTracking, hospitalId, paqueteId, userId }) {
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef()

  useEffect(() => {
    if (trackingId) loadFiles(trackingId)
    else setFiles([])
  }, [trackingId])

  async function loadFiles(id = trackingId) {
    if (!id) return
    const { data } = await supabase
      .from('package_files')
      .select('*')
      .eq('package_tracking_id', id)
      .order('fecha_subida', { ascending: false })
    setFiles(data || [])
  }

  async function handleFileSelect(e) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''

    setError('')
    if (!ALLOWED_TYPES.includes(file.type)) {
      const ext = file.name.split('.').pop().toLowerCase()
      if (!['pdf', 'xls', 'xlsx'].includes(ext)) {
        setError('Solo se permiten archivos PDF y Excel (.xls, .xlsx).')
        return
      }
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`El archivo supera el límite de ${MAX_SIZE_MB} MB.`)
      return
    }

    setUploading(true)

    // Crea el registro de seguimiento si aún no existe
    let tid = trackingId
    if (!tid) {
      const t = await ensureTracking()
      tid = t?.id
    }
    if (!tid) { setError('No se pudo crear el registro del paquete.'); setUploading(false); return }

    const safeName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
    const path = `${userId}/${hospitalId}/${paqueteId}/${safeName}`

    const { error: upErr } = await supabase.storage.from('documentos').upload(path, file)
    if (upErr) { setError('Error al subir el archivo: ' + upErr.message); setUploading(false); return }

    await supabase.from('package_files').insert({
      package_tracking_id: tid,
      nombre_archivo: file.name,
      tipo: file.name.split('.').pop().toLowerCase(),
      ruta_storage: path,
    })

    await loadFiles(tid)
    setUploading(false)
  }

  async function handleDownload(file) {
    const { data } = await supabase.storage.from('documentos').createSignedUrl(file.ruta_storage, 3600)
    if (data?.signedUrl) window.open(data.signedUrl, '_blank')
  }

  async function handleDelete(file) {
    if (!confirm(`¿Eliminar "${file.nombre_archivo}"?`)) return
    await supabase.storage.from('documentos').remove([file.ruta_storage])
    await supabase.from('package_files').delete().eq('id', file.id)
    await loadFiles()
  }

  return (
    <div style={{ background: '#1A1D23', border: '1px solid #2D3139', borderRadius: 12, padding: 16, marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.5 }}>
          C · Archivos
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          style={{ background: '#2D3139', color: '#9CA3AF', border: 'none', borderRadius: 6, padding: '5px 12px', fontSize: 12, cursor: uploading ? 'wait' : 'pointer' }}
        >
          {uploading ? 'Subiendo...' : '+ Subir archivo'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept={ALLOWED_EXT.join(',')}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </div>

      {error && (
        <div style={{ background: '#EF444422', border: '1px solid #EF444444', borderRadius: 6, padding: '8px 12px', color: '#EF4444', fontSize: 12, marginBottom: 10 }}>
          {error}
        </div>
      )}

      {files.length === 0 ? (
        <div style={{ color: '#4B5563', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>
          Sin archivos. Sube el primero con el botón de arriba.<br />
          <span style={{ fontSize: 11 }}>Formatos: PDF, Excel · Máx. {MAX_SIZE_MB} MB</span>
        </div>
      ) : (
        files.map(f => (
          <div key={f.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #2D3139' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
              <span>{fileIcon(f.tipo)}</span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, color: '#D1D5DB', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.nombre_archivo}</div>
                <div style={{ fontSize: 10, color: '#6B7280' }}>{f.tipo?.toUpperCase()} · {fmtDate(f.fecha_subida)}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexShrink: 0, marginLeft: 8 }}>
              <button onClick={() => handleDownload(f)} title="Descargar" style={{ background: '#2D3139', border: 'none', borderRadius: 5, color: '#9CA3AF', cursor: 'pointer', fontSize: 12, padding: '4px 8px' }}>↓</button>
              <button onClick={() => handleDelete(f)} title="Eliminar" style={{ background: 'none', border: 'none', color: '#4B5563', cursor: 'pointer', fontSize: 14 }}>✕</button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
