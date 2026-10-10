import { useEffect, useState } from 'react';
import { Alert } from '../../shared/components/alert';
import { SearchBar } from '../../shared/components/search-bar';
import { Pagination } from '../../shared/components/pagination';
import { equipoService } from '../../core/services/equipo.service';
import type { Equipo } from '../../models/equipo.model';
import './equipos.css';

interface ApiError { status?: number; message?: string; }

function badgeEstado(estado?: string | null) {
  const e = (estado ?? '').toLowerCase();
  if (e.includes('oper')) return 'badge badge--verde';
  if (e.includes('manten')) return 'badge badge--amarillo';
  if (e.includes('inac')) return 'badge badge--gris';
  return 'badge badge--azul';
}

function badgeAlerta(dias?: number | null) {
  if (dias === null || dias === undefined) return 'badge';
  if (dias > 30) return 'badge badge--verde';
  if (dias > 0 && dias <= 30) return 'badge badge--amarillo';
  return 'badge badge--rojo';
}

export function EquiposPage() {
  const [items, setItems] = useState<Equipo[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargar = async () => {
    setLoading(true); setError(null);
    try {
      const resp = await equipoService.getPaged({ page, pageSize, search: search.trim() || undefined });
      setItems(resp.items ?? []);
      setTotalPages(resp.totalPages ?? 1);
    } catch (err) {
      const api = err as ApiError;
      setError(api?.message ?? 'Error al cargar flota');
    } finally { setLoading(false); }
  };

  useEffect(() => { void cargar(); }, [page, pageSize, search]);

  return (
    <div className='equipos-page'>
      <div className='operaciones-page__header'><h1>Gestión de Flota</h1></div>
      {error && <Alert type='error' message={error} onClose={() => setError(null)} />}
      <SearchBar onSearch={setSearch} placeholder='Buscar por placa, código, modelo...' />
      {loading && <div>Cargando...</div>}
      <div className='equipos-grid'>
        {items.map((eq, idx) => (
          <div key={idx} className='card-eq'>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>{eq.noPlaca ?? eq.codEquipo}</strong>
              <span className={badgeEstado(eq.estatusEquipo)}>{eq.estatusEquipo ?? '-'}</span>
            </div>
            <div>{eq.marca} {eq.modelo} - {eq.tipoEquipo}</div>
            <div>Kilometraje: {eq.kilometraje ?? '-'}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>SOAT</span>
                <span className={badgeAlerta(eq.diasParaVencerSOAT)}>{eq.fechaVencimientoSOAT ?? '-'} ({eq.diasParaVencerSOAT ?? '-'}d)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Revisión Técnica</span>
                <span className={badgeAlerta(eq.diasParaVencerRevisionTecnica)}>{eq.fechaVencimientoRevisionTecnica ?? '-'} ({eq.diasParaVencerRevisionTecnica ?? '-'}d)</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Pagination page={page} totalPages={totalPages} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={(s)=>{setPageSize(s);setPage(1);}} hasPrevious={page>1} hasNext={page<totalPages} />
    </div>
  );
}
