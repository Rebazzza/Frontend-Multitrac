import { useMemo, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { authService } from '../../core/services/auth.service';
import logo from '../../../assets/logo.png';
import './main-layout.css';
import './main-layout-icons.css';

interface NavItem {
  label: string;
  to: string;
  icon: string;
}

const ICONS: Record<string, ReactNode> = {
  monedas: (
    <>
      <circle cx="9" cy="14" r="5" />
      <circle cx="15" cy="10" r="4" />
      <path d="M9 9v10" />
      <path d="M15 6v8" />
    </>
  ),
  banco: (
    <>
      <path d="M3 21h18" />
      <path d="M5 21V10" />
      <path d="M19 21V10" />
      <path d="M4 4l8-2 8 2" />
      <path d="M2 10h20" />
      <path d="M8 10v6" />
      <path d="M12 10v6" />
      <path d="M16 10v6" />
    </>
  ),
  cargo: (
    <>
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </>
  ),
  educacion: (
    <>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </>
  ),
  afp: (
    <>
      <line x1="19" y1="5" x2="5" y2="19" />
      <circle cx="6.5" cy="6.5" r="2.5" />
      <circle cx="17.5" cy="17.5" r="2.5" />
    </>
  ),
  flota: (
    <>
      <rect x="1" y="3" width="15" height="13" />
      <path d="M16 8h4l3 3v5h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </>
  ),
  actividad: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
  turno: (
    <>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </>
  ),
  pago: (
    <>
      <rect x="1" y="4" width="22" height="16" rx="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </>
  ),
  ocurrencia: (
    <>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </>
  ),
  inicio: (
    <>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </>
  ),
  personal: (
    <>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  documento: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </>
  ),
  clave: (
    <>
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
      <path d="M6 21v-2" />
    </>
  ),
  logout: (
    <>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </>
  ),
  collapse: (
    <>
      <polyline points="11 17 6 12 11 7" />
      <polyline points="18 17 13 12 18 7" />
    </>
  ),
};

const MODULE_ITEMS: { label: string; icon: string; to?: string }[] = [
  { label: 'INICIO', icon: 'inicio', to: '/' },
  { label: 'OPERACIONES', icon: 'flota', to: '/operaciones' },
  { label: 'FLETES', icon: 'documento', to: '/operaciones/fletes' },
  { label: 'SUEÑO', icon: 'turno', to: '/sueno' },
  { label: 'VENCIMIENTOS', icon: 'documento', to: '/personal/vencimientos' },
  { label: 'CHECKLIST', icon: 'flota', to: '/checklist' },
  { label: 'PRE-OP', icon: 'flota', to: '/checklist/nuevo' },
  { label: 'HIST. CHECKLIST', icon: 'documento', to: '/checklist/historial' },
  { label: 'FLOTA', icon: 'flota', to: '/equipos' },
  { label: 'PERSONAL', icon: 'personal', to: '/personal' },
  { label: 'DOC. PERSONAL', icon: 'documento', to: '/personal-documentos' },
  { label: 'DOCUMENTOS', icon: 'documento', to: '/documentos' },
  { label: 'CAMBIO DE CLAVE', icon: 'clave', to: '/change-password' },
];

const CATALOG_ITEMS: NavItem[] = [
  { label: 'MONEDAS', to: '/catalogos/monedas', icon: 'monedas' },
  { label: 'BANCOS', to: '/catalogos/bancos', icon: 'banco' },
  { label: 'CARGOS', to: '/catalogos/cargos', icon: 'cargo' },
  { label: 'NIV. EDUCATIVOS', to: '/catalogos/niveles-educativos', icon: 'educacion' },
  { label: 'AFPS', to: '/catalogos/afps', icon: 'afp' },
  { label: 'FLOTAS', to: '/catalogos/flotas', icon: 'flota' },
  { label: 'ACTIVIDADES', to: '/catalogos/actividades', icon: 'actividad' },
  { label: 'TURNOS', to: '/catalogos/turnos', icon: 'turno' },
  { label: 'TIPOS DE PAGO', to: '/catalogos/tipos-pago', icon: 'pago' },
  { label: 'TIP. OCURRENCIA', to: '/catalogos/tipos-ocurrencia', icon: 'ocurrencia' },
];

function NavIcon({ name }: { name: string }) {
  return (
    <svg
      className="sidebar__icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICONS[name]}
    </svg>
  );
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0] ?? '')
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

/**
 * Coincidencia por segmento de ruta: exacta o como prefijo de carpeta.
 * Evita que `/personal` active en `/personal-documentos` (que no es un hijo real).
 */
function matchesPath(pathname: string, to: string): boolean {
  if (to === '/') return pathname === '/';
  return pathname === to || pathname.startsWith(`${to}/`);
}

export function MainLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const fullName = authService.getFullName() ?? '';
  const username = authService.getUsername() ?? '';
  const roles = authService.getRoles();
  const cargo = roles[0] ?? 'Usuario';

  // Un único destino activo: gana la coincidencia más específica (ruta más larga).
  const activePath = useMemo(() => {
    const rutas = [...MODULE_ITEMS, ...CATALOG_ITEMS]
      .map((item) => item.to)
      .filter((to): to is string => Boolean(to));
    return rutas
      .filter((to) => matchesPath(pathname, to))
      .sort((a, b) => b.length - a.length)[0] ?? '';
  }, [pathname]);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <aside className={`layout__sidebar ${collapsed ? 'layout__sidebar--collapsed' : ''}`}>
        <header className="sidebar__brand">
          <img src={logo} className="sidebar__logo-img" alt="Atento Multitrac" />
          <h1 className="sidebar__logo">
            ATENTO
            <br />
            MULTITRAC
          </h1>
          <button
            type="button"
            className="sidebar__collapse"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? 'Expandir menú lateral' : 'Contraer menú lateral'}
          >
            <NavIcon name="collapse" />
          </button>
        </header>

        <nav className="sidebar__nav" aria-label="Secciones de la aplicación">
          {MODULE_ITEMS.map((item) =>
            item.to ? (
              <NavLink
                key={item.label}
                to={item.to}
                end
                className={`sidebar__link ${item.to === activePath ? 'sidebar__link--active' : ''}`}
              >
                <NavIcon name={item.icon} />
                <span className="sidebar__link-label">{item.label}</span>
              </NavLink>
            ) : (
              <button key={item.label} type="button" className="sidebar__link sidebar__link--button">
                <NavIcon name={item.icon} />
                <span className="sidebar__link-label">{item.label}</span>
              </button>
            ),
          )}
          <div className="sidebar__divider">Catálogos</div>
          {CATALOG_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={`sidebar__link ${item.to === activePath ? 'sidebar__link--active' : ''}`}
            >
              <NavIcon name={item.icon} />
              <span className="sidebar__link-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <button type="button" className="sidebar__logout" onClick={handleLogout}>
          <NavIcon name="logout" />
          <span className="sidebar__link-label">Cerrar Sesión</span>
        </button>
      </aside>

      <div className="layout__content">
        <header className="layout__header">
          <div className="header__user" aria-label={`Menú de usuario de ${fullName || 'Usuario'}`}>
            <span className="header__avatar">{getInitials(fullName) || 'U'}</span>
            <div className="header__identity">
              <span className="header__name">{fullName || 'Usuario'}</span>
              <span className="header__meta">
                {username ? `${username} · ` : ''}
                {cargo}
              </span>
            </div>
          </div>
        </header>
        <main className="layout__main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}