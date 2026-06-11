import { useState } from 'react'
import { supabase } from '../lib/supabase'

const C = {
  page: { minHeight: '100vh', background: '#111318', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif", padding: 16 },
  card: { background: '#1A1D23', border: '1px solid #2D3139', borderRadius: 16, padding: 36, width: '100%', maxWidth: 380 },
  logo: { color: '#00B2A9', fontWeight: 900, fontSize: 22, letterSpacing: -0.5, marginBottom: 4 },
  subtitle: { color: '#6B7280', fontSize: 12, marginBottom: 32 },
  label: { display: 'block', fontSize: 11, fontWeight: 700, color: '#6B7280', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { width: '100%', background: '#111318', border: '1px solid #374151', borderRadius: 8, color: '#E5E7EB', padding: '10px 12px', fontSize: 14, outline: 'none' },
  inputFocus: { border: '1px solid #00B2A9' },
  fieldWrap: { marginBottom: 18 },
  btn: { width: '100%', background: '#00B2A9', color: '#fff', border: 'none', borderRadius: 8, padding: '11px 0', fontSize: 14, fontWeight: 700, cursor: 'pointer', marginTop: 8 },
  btnDisabled: { opacity: 0.6, cursor: 'not-allowed' },
  error: { background: '#EF444422', border: '1px solid #EF444444', borderRadius: 8, padding: '10px 12px', color: '#EF4444', fontSize: 13, marginTop: 14, lineHeight: 1.5 },
}

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [focus, setFocus] = useState('')

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message === 'Invalid login credentials'
        ? 'Correo o contraseña incorrectos.'
        : error.message)
      setLoading(false)
    }
  }

  return (
    <div style={C.page}>
      <div style={C.card}>
        <div style={C.logo}>⚡ Schneider KAM</div>
        <div style={C.subtitle}>Hospitales Chile · Panel de gestión</div>

        <form onSubmit={handleLogin}>
          <div style={C.fieldWrap}>
            <label style={C.label}>Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onFocus={() => setFocus('email')}
              onBlur={() => setFocus('')}
              style={{ ...C.input, ...(focus === 'email' ? C.inputFocus : {}) }}
              placeholder="correo@ejemplo.com"
              autoComplete="email"
              required
            />
          </div>
          <div style={C.fieldWrap}>
            <label style={C.label}>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onFocus={() => setFocus('password')}
              onBlur={() => setFocus('')}
              style={{ ...C.input, ...(focus === 'password' ? C.inputFocus : {}) }}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !email || !password}
            style={{ ...C.btn, ...(loading || !email || !password ? C.btnDisabled : {}) }}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>

          {error && <div style={C.error}>{error}</div>}
        </form>
      </div>
    </div>
  )
}
