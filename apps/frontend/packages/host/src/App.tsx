import { useState, Suspense, lazy } from 'react';
import { Layout, Button } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';

const RemoteAppCIM = lazy(() => import('remoteAppCIM/App'));
const RemoteAppIssues = lazy(() => import('remoteAppIssues/App'));

function App() {
  const [menuOpen, setMenuOpen] = useState(true);
  const [activeApp, setActiveApp] = useState<'remoteAppCIM' | 'remoteAppIssues' | null>(null);

  return (
    <Layout>
      <Layout.Header style={{
        display: 'flex',
        alignItems: 'center',
        padding: 0,
        background: '#222',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: 60,
        zIndex: 100,
      }}>
        <Button
          type="text"
          icon={menuOpen ? <MenuFoldOutlined style={{ color: '#fff', fontSize: 20 }} /> : <MenuUnfoldOutlined style={{ color: '#fff', fontSize: 20 }} />}
          onClick={() => setMenuOpen((open) => !open)}
          style={{ marginLeft: 16, marginRight: 16 }}
        />
        <span style={{ color: '#fff', fontWeight: 'bold', fontSize: 20 }}></span>
      </Layout.Header>
      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 60,
            left: 0,
            width: 200,
            height: 'calc(100vh - 60px)',
            background: '#333',
            color: '#fff',
            zIndex: 200,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '2px 0 8px rgba(0,0,0,0.15)'
          }}
        >
          <Button type="text" style={{ color: '#fff', textAlign: 'left', padding: 16 }} onClick={() => { setActiveApp('remoteAppCIM'); setMenuOpen(false); }}>CIM</Button>
          <Button type="text" style={{ color: '#fff', textAlign: 'left', padding: 16 }} onClick={() => { setActiveApp('remoteAppIssues'); setMenuOpen(false); }}>Issues</Button>
        </div>
      )}
      <Layout.Content 
        style={{ 
          position: 'absolute',
          top: 60, 
          left: 0, 
          width: '100vw', 
          height: 'calc(100vh - 60px)',
          background: '#fff',
          overflow: 'auto',
          padding: 24
        }}
      >
        <Suspense fallback={<div>Загрузка...</div>}>
          {!activeApp && <h1 style={{textAlign: 'center', color: '#888'}}>Выберите модуль</h1>}
          {activeApp === 'remoteAppCIM' && <RemoteAppCIM />}
          {activeApp === 'remoteAppIssues' && <RemoteAppIssues />}
        </Suspense>
      </Layout.Content>
    </Layout>
  );
}

export default App;