import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import type { ReactNode } from 'react';
import { authService } from '../../core/services/auth.service';
import { dashboardService } from '../../core/services/dashboard.service';
import type { DashboardResumen } from '../../models/dashboard.model';
import type { ApiError } from '../../core/interceptors/error.interceptor';
import { Alert } from '../../shared/components/alert';
import './dashboard.css';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

function getFirstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] ?? fullName;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('es-PE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

interface StatCardProps {
  label: string;
  value: number | null;
  icon: ReactNode;
  accent: 'danger' | 'success' | 'warning';
}

function StatCard({ label, value, icon, accent }: StatCardProps) {
  return (
    <div className={`dashboard__stat dashboard__stat--${accent}`}>
      <div className="dashboard__stat-icon">{icon}</div>
      <div className="dashboard__stat-body">
        <span className="dashboard__stat-value">{value === null ? '—' : value}</span>
        <span className="dashboard__stat-label">{label}</span>
      </div>
    </div>
  );
}

interface QuickAction {
  label: string;
  description: string;
  to?: string;
  comingSoon?: boolean;
}

const QUICK_ACTIONS: QuickAction[] = [
  { label: 'Registrar sueño', description: 'Ingreso de sueño de hoy', comingSoon: true },
  { label: 'Checklist de equipos', description: 'Mantenimiento y PdP', comingSoon: true },
  { label: 'Documentos de equipos', description: 'Tractos y carretas', comingSoon: true },
  { label: 'Catálogos', description: 'Monedas, bancos, cargos...' },
];

function QuickActionIcon({ label }: { label: string }) {
  if (label === 'Registrar sueño') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    );
  }
  if (label === 'Checklist de equipos') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    );
  }
  if (label === 'Documentos de equipos') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

export function DashboardPage() {
  const [resumen, setResumen] = useState<DashboardResumen | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      try {
        const result = await dashboardService.getResumen();
        if (!cancelled) setResumen(result);
      } catch (err) {
        if (!cancelled) {
          const apiError = err as ApiError;
          setError(apiError.message || 'Error al cargar el resumen');
        }
      }
    };
    fetch();
    return () => { cancelled = true; };
  }, []);

  const fullName = authService.getFullName() ?? 'Usuario';
  const greeting = getGreeting();
  const dateLabel = formatDate(new Date());

  return (
    <div className="dashboard-page">
      <section className="dashboard__welcome">
        <h1 className="dashboard__title">
          {greeting}, {getFirstName(fullName)}
        </h1>
        <p className="dashboard__date">{dateLabel}</p>
      </section>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <section className="dashboard__stats" aria-label="Resumen del día">
        <StatCard
          label="Documentos expirados"
          value={resumen?.documentosExpirados ?? null}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          }
          accent="danger"
        />
        <StatCard
          label="Checklists registrados"
          value={resumen?.checklistsRegistrados ?? null}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="9 11 12 14 22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          }
          accent="success"
        />
        <StatCard
          label="Ingresos de sueño de hoy"
          value={resumen?.suenosHoy ?? null}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          }
          accent="warning"
        />
      </section>

      <section className="dashboard__actions" aria-label="Acciones rápidas">
        <h2 className="dashboard__section-title">Acciones rápidas</h2>
        <div className="dashboard__actions-grid">
          {QUICK_ACTIONS.map((action) =>
            action.comingSoon ? (
              <button
                key={action.label}
                type="button"
                className="dashboard__action dashboard__action--disabled"
                disabled
              >
                <QuickActionIcon label={action.label} />
                <div className="dashboard__action-body">
                  <span className="dashboard__action-label">{action.label}</span>
                  <span className="dashboard__action-description">{action.description}</span>
                </div>
                <span className="dashboard__action-tag">Próximamente</span>
              </button>
            ) : (
              <NavLink
                key={action.label}
                to={action.to ?? '/catalogos/monedas'}
                className="dashboard__action"
              >
                <QuickActionIcon label={action.label} />
                <div className="dashboard__action-body">
                  <span className="dashboard__action-label">{action.label}</span>
                  <span className="dashboard__action-description">{action.description}</span>
                </div>
              </NavLink>
            ),
          )}
        </div>
      </section>
    </div>
  );
}