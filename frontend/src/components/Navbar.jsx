import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const isActive = (path) => location.pathname === path

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <nav style={s.nav}>
      <div style={s.inner}>
        <Link to="/" style={s.logo}>
          <div style={s.dot} />
          Jobframe
        </Link>
        <div style={s.links}>
          <Link to="/" style={{ ...s.link, ...(isActive('/') ? s.linkActive : {}) }}>Browse</Link>
          {user && <Link to="/dashboard" style={{ ...s.link, ...(isActive('/dashboard') ? s.linkActive : {}) }}>Dashboard</Link>}
        </div>
        <div style={s.actions}>
          {user ? (
            <>
              <div style={s.userChip}>
                <div style={s.avatar}>{user.name?.charAt(0).toUpperCase()}</div>
                <span style={s.userName}>{user.name}</span>
              </div>
              {user.role === 'employer' && (
                <Link to="/post-job" style={s.btnPrimary}>Post a job</Link>
              )}
              <button onClick={handleLogout} style={s.btnOutline}>Sign out</button>
            </>
          ) : (
            <>
              <Link to="/login"    style={s.btnOutline}>Sign in</Link>
              <Link to="/register" style={s.btnPrimary}>Get started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

const s = {
  nav:        { background: '#0B1220', borderBottom: '0.5px solid #1E293B', position: 'sticky', top: 0, zIndex: 100 },
  inner:      { maxWidth: '1100px', margin: '0 auto', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' },
  logo:       { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: 700, color: '#fff', textDecoration: 'none', letterSpacing: '-0.3px', flexShrink: 0 },
  dot:        { width: '8px', height: '8px', background: '#2563EB', borderRadius: '50%' },
  links:      { display: 'flex', gap: '2px', flex: 1, justifyContent: 'center' },
  link:       { fontSize: '13px', color: '#94A3B8', textDecoration: 'none', padding: '5px 12px', borderRadius: '6px' },
  linkActive: { color: '#fff', background: '#1E293B' },
  actions:    { display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 },
  userChip:   { display: 'flex', alignItems: 'center', gap: '7px', marginRight: '4px' },
  avatar:     { width: '28px', height: '28px', borderRadius: '50%', background: '#1D4ED8', color: '#fff', fontSize: '11px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  userName:   { fontSize: '13px', color: '#CBD5E1' },
  btnOutline: { fontSize: '12px', color: '#94A3B8', border: '0.5px solid #334155', padding: '6px 14px', borderRadius: '6px', background: 'none', textDecoration: 'none', cursor: 'pointer', fontFamily: 'inherit' },
  btnPrimary: { fontSize: '12px', color: '#fff', background: '#2563EB', border: 'none', padding: '6px 14px', borderRadius: '6px', textDecoration: 'none', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' },
}