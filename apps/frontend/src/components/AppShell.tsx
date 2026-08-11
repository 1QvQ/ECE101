import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import Icon, { type IconName } from './Icon';

const navigation: Array<{ to: string; label: string; icon: IconName; end?: boolean }> = [
  { to: '/dashboard', label: 'Today', icon: 'home', end: true },
  { to: '/activities', label: 'Activity ideas', icon: 'spark' },
  { to: '/knowledge', label: 'My knowledge', icon: 'book' },
  { to: '/documents', label: 'Documents', icon: 'file' },
];

export default function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login', { replace: true });
  };

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="topbar">
        <div className="topbar-inner">
          <NavLink to="/dashboard" className="brand" aria-label="ECE101 home">
            <span className="brand-mark"><Icon name="leaf" size={19} /></span>
            <span>ECE<span>101</span></span>
          </NavLink>

          <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => isActive ? 'nav-link is-active' : 'nav-link'}
              >
                <Icon name={item.icon} size={18} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="topbar-actions">
            <button className="icon-button desktop-logout" type="button" onClick={handleLogout} aria-label="Sign out">
              <Icon name="logout" size={19} />
            </button>
            <button
              className="icon-button mobile-menu"
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              aria-expanded={menuOpen}
              aria-label="Toggle navigation"
            >
              <Icon name={menuOpen ? 'close' : 'menu'} size={21} />
            </button>
          </div>
        </div>
      </header>

      <main id="main-content" className="workspace">
        <Outlet />
      </main>
    </div>
  );
}
