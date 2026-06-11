import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { supabase, isConfigured } from './lib/supabase'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

const SE = "'Nunito', -apple-system, 'Segoe UI', Arial, sans-serif"

const C = {
  wrap: { minHeight: '100vh', background: '#F9F9F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SE },
  msg: { color: '#626469', fontSize: 14 },
  card: { background: '#FFFFFF', borderRadius: 8, padding: 28, maxWidth: 400, textAlign: 'center', border: '1px solid #E0E0E0', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  cardTitle: { color: '#E47F00', fontWeight: 700, marginBottom: 10, fontSize: 15 },
  cardText: { color: '#626469', fontSize: 13, lineHeight: 1.7 },
  code: { background: '#F9F9F9', padding: '2px 6px', borderRadius: 4, color: '#008029', fontFamily: 'monospace', border: '1px solid #E0E0E0' },
}

export default function App() {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    if (!isConfigured) { setSession(null); return }
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => subscription.unsubscribe()
  }, [])

  if (!isConfigured) {
    return (
      <div style={C.wrap}>
        <div style={C.card}>
          <div style={C.cardTitle}>⚙️ Configuración pendiente</div>
          <div style={C.cardText}>
            Falta conectar Supabase. Abre el archivo <span style={C.code}>.env</span> y reemplaza los valores <span style={C.code}>PENDIENTE</span> con tu URL y clave anónima de Supabase.
          </div>
        </div>
      </div>
    )
  }

  if (session === undefined) {
    return <div style={C.wrap}><div style={C.msg}>Cargando...</div></div>
  }

  return (
    <Routes>
      <Route path="/login" element={!session ? <Login /> : <Navigate to="/" replace />} />
      <Route path="/*" element={session ? <Dashboard session={session} /> : <Navigate to="/login" replace />} />
    </Routes>
  )
}
