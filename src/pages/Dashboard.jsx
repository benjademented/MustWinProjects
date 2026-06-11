import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Header from '../components/Header'
import ProyectosTab from '../tabs/ProyectosTab'
import MinutasTab from '../tabs/MinutasTab'
import ResumenTab from '../tabs/ResumenTab'
import PackageDrawer from '../components/PackageDrawer'

export default function Dashboard({ session }) {
  const [activeTab, setActiveTab] = useState('proyectos')
  const [drawerData, setDrawerData] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [minutasCount, setMinutasCount] = useState(0)

  useEffect(() => {
    supabase
      .from('minutas')
      .select('id', { count: 'exact', head: true })
      .then(({ count }) => setMinutasCount(count || 0))
  }, [refreshKey])

  function handleCloseDrawer() {
    setDrawerData(null)
    setRefreshKey(k => k + 1)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F9F9F9', fontFamily: "'Nunito', -apple-system, 'Segoe UI', Arial, sans-serif", color: '#333333' }}>
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        minutasCount={minutasCount}
        onSignOut={handleSignOut}
      />

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '16px 14px' }}>
        {activeTab === 'proyectos' && (
          <ProyectosTab
            refreshKey={refreshKey}
            userId={session.user.id}
            onOpenPackage={setDrawerData}
          />
        )}
        {activeTab === 'minutas' && (
          <MinutasTab
            userId={session.user.id}
            onMinutasChange={() => setRefreshKey(k => k + 1)}
          />
        )}
        {activeTab === 'resumen' && (
          <ResumenTab refreshKey={refreshKey} />
        )}
      </div>

      {drawerData && (
        <PackageDrawer
          hospitalId={drawerData.hospitalId}
          hospitalNombre={drawerData.hospitalNombre}
          paqueteId={drawerData.paqueteId}
          projectColor={drawerData.projectColor}
          userId={session.user.id}
          onClose={handleCloseDrawer}
        />
      )}
    </div>
  )
}
