import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { Alert } from '../../shared/components/alert';
import { SearchBar } from '../../shared/components/search-bar';
import { Pagination } from '../../shared/components/pagination';
import { DataTable } from '../../shared/components/data-table';
import type { Column } from '../../shared/components/data-table';
import { equipoChecklistService } from '../../core/services/equipo-checklist.service';
import type { EquipoChecklist } from '../../models/equipo-checklist.model';
import './checklist-mobile.css';

interface ApiError { status?: number; message?: string; }

export function HistorialChecklistPage() {
  const [items, setItems] = useState<EquipoChecklist[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<string | undefined>();
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [placa, setPlaca] = useState('');
  const [estado, setEstado] = useState('');

  const cargar = async () => {
    setLoading(true); setError(null);
    try {
      const resp = await equipoChecklistService.getPaged({ page, pageSize, search: search.trim() || undefined, sortBy, sortDirection });
      setItems(resp.items ?? []);
      setTotalPages(resp.totalPages ?? 1);
    } catch (err) {
      const api = err as ApiError;
      setError(api?.message ?? 'Error al cargar historial');
    } finally { setLoading(false); }
  };

  useEffect(() => { void cargar(); }, [page, pageSize, search, sortBy, sortDirection]);

  const handleSort = (k: string) => {
    if (sortBy === k) setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    else { setSortBy(k); setSortDirection('asc'); }
  };

  const handleFiltrar = (e: FormEvent) => { e.preventDefault(); setPage(1); void cargar(); };

  const columns: Column<EquipoChecklist>[] = [
    { key: 'idEquipoChecklist', header: 'ID', sortable: true },
    { key: 'fecha', header: 'Fecha', sortable: true },
    { key: 'hora', header: 'Hora' },
    { key: 'placaTracto', header: 'Placa Tracto' },
    { key: 'placaCarreta', header: 'Placa Carreta' },
    { key: 'codigoTracto', header: 'Tracto' },
    { key: 'codigoCarreta', header: 'Carreta' },
    { key: 'kilometraje', header: 'Km' },
    { key: 'resultado', header: 'Estado' },
  ];

  const filtrados = items.filter((it) => {
    if (placa && !(it.placaTracto?.includes(placa) || it.placaCarreta?.includes(placa))) return false;
    if (estado && it.resultado !== estado) return false;
    if (fechaDesde && it.fecha && it.fecha < fechaDesde) return false;
    if (fechaHasta && it.fecha && it.fecha > fechaHasta) return false;
    return true;
  });

  return (
    <div className='checklist-mobile'>
      <div className='operaciones-page__header'><h1>Historial de Inspecciones</h1></div>
      {error && <Alert type='error' message={error} onClose={() => setError(null)} />}
      <form className='operaciones-filtros' onSubmit={handleFiltrar}>
        <div className='grid-2'>
          <div><label>Fecha Desde</label><input type='date' value={fechaDesde} onChange={(e: ChangeEvent<HTMLInputElement>) => setFechaDesde(e.target.value)} /></div>
          <div><label>Fecha Hasta</label><input type='date' value={fechaHasta} onChange={(e: ChangeEvent<HTMLInputElement>) => setFechaHasta(e.target.value)} /></div>
          <div><label>Placa</label><input type='text' value={placa} onChange={(e: ChangeEvent<HTMLInputElement>) => setPlaca(e.target.value)} /></div>
          <div><label>Estado</label><select value={estado} onChange={(e: ChangeEvent<HTMLSelectElement>) => setEstado(e.target.value)}><option value=''>Todos</option><option value='Aprobado'>Aprobado</option><option value='Rechazado'>Rechazado</option></select></div>
        </div>
        <button type='submit' className='btn-secondary touch-btn'>Filtrar</button>
      </form>
      <SearchBar onSearch={setSearch} placeholder='Buscar...' />
      <DataTable columns={columns} data={filtrados as unknown as Record<string, unknown>[]} onSort={handleSort} sortBy={sortBy} sortDirection={sortDirection} emptyMessage={loading ? 'Cargando...' : 'Sin registros'} />
      <Pagination page={page} totalPages={totalPages} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={(s)=>{setPageSize(s);setPage(1);}} hasPrevious={page>1} hasNext={page<totalPages} />
    </div>
  );
}

