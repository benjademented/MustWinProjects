import { useState } from 'react'
import { supabase } from '../lib/supabase'

const SE = "'Nunito', -apple-system, 'Segoe UI', Arial, sans-serif"

const C = {
  page: { minHeight: '100vh', background: '#F9F9F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SE, padding: 16 },
  card: { background: '#FFFFFF', border: '1px solid #E0E0E0', borderRadius: 8, padding: '40px 36px', width: '100%', maxWidth: 380, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  logoWrap: { marginBottom: 28 },
  logo: { color: '#3DCD58', fontWeight: 800, fontSize: 22, letterSpacing: -0.5, display: 'flex', alignItems: 'center', gap: 8 },
  logoDot: { width: 10, height: 10, borderRadius: '50%', background: '#3DCD58', display: 'inline-block' },
  subtitle: { color: '#626469', fontSize: 13, marginTop: 4 },
  label: { display: 'block', fontSize: 12, fontWeight: 700, color: '#333333', marginBottom: 6 },
  input: { width: '100%', background: '#FFFFFF', border: '1px solid #E0E0E0', borderRadius: 4, color: '#333333', padding: '10px 12px', fontSize: 14, outline: 'none', transition: 'border-color 0.15s' },
  inputFocus: { borderColor: '#3DCD58', boxShadow: '0 0 0 3px rgba(61,205,88,0.12)' },
  fieldWrap: { marginBottom: 18 },
  btn: { width: '100%', background: '#3DCD58', color: '#fff', border: 'none', borderRadius: 4, padding: '12px 0', fontSize: 14, fontWeight: 700, cursor: 'pointer', marginTop: 8, transition: 'background 0.15s' },
  btnDisabled: { opacity: 0.6, cursor: 'not-allowed' },
  error: { background: 'rgba(220,10,10,0.06)', border: '1px solid rgba(220,10,10,0.2)', borderRadius: 4, padding: '10px 12px', color: '#DC0A0A', fontSize: 13, marginTop: 14, lineHeight: 1.5 },
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
        <div style={C.logoWrap}>
          <div style={C.logo}>
            <span style={C.logoDot} />
            Schneider KAM
          </div>
          <div style={C.subtitle}>Hospitales Chile · Panel de gestión</div>
        </div>

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
