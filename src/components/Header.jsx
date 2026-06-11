const SE = "'Nunito', -apple-system, 'Segoe UI', Arial, sans-serif"

const C = {
  wrap: { background: '#FFFFFF', borderBottom: '1px solid #E0E0E0', padding: '12px 18px', position: 'sticky', top: 0, zIndex: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  inner: { maxWidth: 720, margin: '0 auto', fontFamily: SE },
  top: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  logoWrap: { display: 'flex', alignItems: 'center', gap: 8 },
  logoDot: { width: 10, height: 10, borderRadius: '50%', background: '#3DCD58', flexShrink: 0 },
  logo: { color: '#333333', fontWeight: 800, fontSize: 16 },
  sub: { color: '#626469', fontSize: 11, marginTop: 1 },
  actions: { display: 'flex', gap: 8, alignItems: 'center' },
  recordBtn: {
    background: 'transparent', color: '#626469', border: '1px solid #E0E0E0',
    borderRadius: 4, padding: '6px 12px', fontWeight: 700, fontSize: 12,
    cursor: 'not-allowed', display: 'flex', alignItems: 'center', gap: 6,
    fontFamily: SE,
  },
  signOutBtn: { background: 'transparent', color: '#626469', border: 'none', cursor: 'pointer', fontSize: 12, padding: '6px 0', fontFamily: SE },
  tabs: { display: 'flex', gap: 4 },
}

export default function Header({ activeTab, setActiveTab, minutasCount, onSignOut }) {
  const tabs = [
    { id: 'proyectos', label: 'Proyectos' },
    { id: 'minutas', label: `Minutas (${minutasCount})` },
    { id: 'resumen', label: 'Resumen' },
  ]

  return (
    <div style={C.wrap}>
      <div style={C.inner}>
        <div style={C.top}>
          <div>
            <div style={C.logoWrap}>
              <span style={C.logoDot} />
              <span style={C.logo}>Schneider KAM</span>
            </div>
            <div style={C.sub}>Proyectos Must Win · Benjamín Padilla</div>
          </div>
          <div style={C.actions}>
            <button
              style={C.recordBtn}
              title="Próximamente: grabación de minutas con IA"
              disabled
            >
              🎙 Grabar minuta
            </button>
            <button style={C.signOutBtn} onClick={onSignOut}>Salir</button>
          </div>
        </div>
        <div style={C.tabs}>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                background: activeTab === t.id ? '#3DCD58' : 'transparent',
                color: activeTab === t.id ? '#fff' : '#626469',
                border: activeTab === t.id ? 'none' : '1px solid transparent',
                borderRadius: 4,
                padding: '5px 14px',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: SE,
                transition: 'background 0.15s, color 0.15s',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
