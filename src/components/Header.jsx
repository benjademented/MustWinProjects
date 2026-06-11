const C = {
  wrap: { background: '#1A1D23', borderBottom: '1px solid #2D3139', padding: '14px 18px', position: 'sticky', top: 0, zIndex: 10 },
  inner: { maxWidth: 720, margin: '0 auto' },
  top: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  logo: { color: '#00B2A9', fontWeight: 900, fontSize: 17, letterSpacing: -0.5 },
  sub: { color: '#6B7280', fontSize: 11, marginTop: 2 },
  actions: { display: 'flex', gap: 8, alignItems: 'center' },
  recordBtn: { background: 'transparent', color: '#374151', border: '1px solid #374151', borderRadius: 8, padding: '7px 12px', fontWeight: 700, fontSize: 12, cursor: 'not-allowed', display: 'flex', alignItems: 'center', gap: 6 },
  signOutBtn: { background: 'transparent', color: '#6B7280', border: 'none', cursor: 'pointer', fontSize: 12, padding: '7px 0' },
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
            <div style={C.logo}>⚡ Schneider KAM</div>
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
                background: activeTab === t.id ? '#00B2A9' : 'transparent',
                color: activeTab === t.id ? '#fff' : '#6B7280',
                border: 'none', borderRadius: 6, padding: '5px 12px',
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
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
