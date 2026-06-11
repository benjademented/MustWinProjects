import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { supabase, isConfigured } from './lib/supabase'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

const C = {
  wrap: { minHeight: '100vh', background: '#111318', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif" },
  msg: { color: '#6B7280', fontSize: 14 },
  card: { background: '#1A1D23', borderRadius: 12, padding: 28, maxWidth: 400, textAlign: 'center', border: '1px solid #2D3139' },
  cardTitle: { color: '#F5A623', fontWeight: 700, marginBottom: 10, fontSize: 15 },
  cardText: { color: '#6B7280', fontSize: 13, lineHeight: 1.7 },
  code: { background: '#111318', padding: '2px 6px', borderRadius: 4, color: '#00B2A9', fontFamily: 'monospace' },
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
