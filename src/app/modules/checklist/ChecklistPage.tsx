import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from '../../shared/components/alert';
import { SearchBar } from '../../shared/components/search-bar';
import { Pagination } from '../../shared/components/pagination';
import { DataTable, type Column } from '../../shared/components/data-table';
import { checklistService } from '../../core/services/checklist.service';
import { personalService } from '../../core/services/personal.service';
import { formatFecha } from '../../core/utils/format';
import type { PagedResponse } from '../../models/paged-response.model';
import type { Personal } from '../../models/personal.model';
import type {
  ChecklistDto,
  ChecklistPagedParams,
  CrearChecklistDto,
} from '../../models/checklist.model';
import type { ApiError } from '../../core/interceptors/error.interceptor';
import { ChecklistFormModal } from './components/ChecklistFormModal';
import { OperacionChecklistTab } from './components/OperacionChecklistTab';
import { colorEstado, normalizarEstado } from './components/checklist-estado';
import {
  CHECKLIST_AREAS,
  CHECKLIST_ESTADOS,
  CHECKLIST_TIPOS,
} from './components/checklist-catalogos';
import './checklist-page.css';

type Tab = 'checklists' | 'operacion';

/** "T8G-826 / TPH-993" o "T8G-826" si no hay carreta. "__-____" es el placeholder vacio del legacy. */
function equipos(item: ChecklistDto): string {
  const tracto = item.equipo?.trim();
  const carreta = item.acoplado?.trim();
  const partes = [tracto, carreta]
    .filter((v) => v && v !== '__-____')
    .join(' / ');
  return partes || '—';
}

export function ChecklistPage() {
  const [tab, setTab] = useState<Tab>('checklists');

  const [data, setData] = useState<PagedResponse<ChecklistDto> | null>(null);
  const [personalList, setPersonalList] = useState<Personal[]>([]);

  const [params, setParams] = useState<ChecklistPagedParams>({
    page: 1,
    pageSize: 25,
    sortBy: 'fecha',
    sortDirection: 'desc',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    let cancelled = false;
    personalService
      .getPaged({ page: 1, pageSize: 9999 })
      .then((r) => { if (!cancelled) setPersonalList(r.items ?? []); })
      .catch(() => { if (!cancelled) setPersonalList([]); });
    return () => { cancelled = true; };
  }, []);

  const consulta = params;

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      setLoading(true);
      setError('');
      try {
        const result = await checklistService.getPaged(consulta);
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) {
          const apiError = err as ApiError;
          setError(apiError.message || 'Error al cargar los checklists.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetch();
    return () => { cancelled = true; };
  }, [consulta, reloadKey]);

  const columns = useMemo<Column<ChecklistDto>[]>(
    () => [
      {
        key: 'codigo',
        header: 'Codigo',
        sortable: true,
        render: (item) => <span>{item.codigoChecklist?.trim() || '—'}</span>,
      },
      {
        key: 'equipo',
        header: 'Equipo',
        sortable: true,
        render: (item) => <span>{equipos(item)}</span>,
      },
      {
        key: 'conductor',
        header: 'Conductor',
        sortable: true,
        render: (item) => <span>{item.conductor?.trim() || '—'}</span>,
      },
      {
        key: 'fecha',
        header: 'Fecha',
        sortable: true,
        render: (item) => (
          <span>
            {formatFecha(item.fecha)}
            {item.hora ? ` ${item.hora}` : ''}
          </span>
        ),
      },
      {
        key: 'area',
        header: 'Area',
        sortable: true,
        render: (item) => <span>{item.area?.trim() || '—'}</span>,
      },
      {
        key: 'estado',
        header: 'Estado',
        sortable: true,
        render: (item) => (
          <span
            className="checklist-badge"
            style={{ backgroundColor: item.colorEstado || colorEstado(item.estado) }}
          >
            {normalizarEstado(item.estado)}
          </span>
        ),
      },
      {
        key: 'revisor',
        header: 'Revisor',
        sortable: true,
        render: (item) => <span>{item.revisor?.trim() || '—'}</span>,
      },
      {
        key: 'extintores',
        header: 'Extintores',
        render: (item) => (
          <span className="checklist-ext">
            {item.extFecCad01 ? `01: ${item.extFecCad01}` : '01: —'}
            {' | '}
            {item.extFecCad02 ? `02: ${item.extFecCad02}` : '02: —'}
          </span>
        ),
      },
      {
        key: 'observaciones',
        header: 'Observaciones',
        sortable: true,
        render: (item) => <span>{item.observaciones?.trim() || '—'}</span>,
      },
    ],
    [],
  );

  const handleSearch = useCallback((search: string) => {
    setParams((prev) => ({ ...prev, search, page: 1 }));
  }, []);

  const handleSort = (key: string) => {
    setParams((prev) => ({
      ...prev,
      sortBy: key,
      sortDirection: prev.sortBy === key && prev.sortDirection === 'asc' ? 'desc' : 'asc',
    }));
  };

  const limpiarFiltros = () => {
    setParams((prev) => ({ ...prev, page: 1, search: '' }));
  };

  const handleSubmit = async (values: CrearChecklistDto) => {
    await checklistService.crear(values);
    setShowForm(false);
    setSuccess(
      `Checklist ${values.codigoChecklist ?? ''} registrado para ${values.equipo ?? ''}`.trim(),
    );
    setReloadKey((k) => k + 1);
  };

  const hayFiltros = Boolean(params.search);

  return (
    <div className="checklist-page">
      <div className="checklist-page__header">
        <h1 className="checklist-page__title">Checklist</h1>
        {tab === 'checklists' && (
          <button type="button" className="checklist-page__add" onClick={() => setShowForm(true)}>
            Nuevo checklist
          </button>
        )}
      </div>

      <div className="checklist-page__tabs">
        <button
          type="button"
          className={tab === 'checklists' ? 'is-active' : ''}
          onClick={() => setTab('checklists')}
        >
          Checklists
        </button>
        <button
          type="button"
          className={tab === 'operacion' ? 'is-active' : ''}
          onClick={() => setTab('operacion')}
        >
          Revisiones por operacion
        </button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      {tab === 'operacion' ? (
        <OperacionChecklistTab
          estados={CHECKLIST_ESTADOS}
          personalList={personalList}
          onSaved={() => setReloadKey((k) => k + 1)}
        />
      ) : (
        <>
          <div className="checklist-page__toolbar">
            <SearchBar onSearch={handleSearch} placeholder="Buscar por equipo, codigo o conductor..." />

            {hayFiltros && (
              <button type="button" className="btn btn--secondary btn--sm" onClick={limpiarFiltros}>
                Limpiar filtros
              </button>
            )}
          </div>

          {loading && <div className="checklist-page__loading">Cargando...</div>}

          <DataTable
            columns={columns as unknown as Column<Record<string, unknown>>[]}
            data={(data?.items ?? []) as unknown as Record<string, unknown>[]}
            onSort={handleSort}
            sortBy={params.sortBy}
            sortDirection={params.sortDirection}
            emptyMessage={loading ? 'Cargando...' : 'No hay checklists para estos filtros.'}
          />
          <Pagination
            page={data?.page ?? 1}
            totalPages={data?.totalPages ?? 1}
            hasPrevious={data?.hasPrevious ?? false}
            hasNext={data?.hasNext ?? false}
            pageSize={params.pageSize ?? 25}
            onPageSizeChange={(n) => setParams((p) => ({ ...p, pageSize: n, page: 1 }))}
            onPageChange={(p) => setParams((prev) => ({ ...prev, page: p }))}
          />
        </>
      )}

      {/* Montado solo abierto: los <select> de area/tipo/estado no necesitan recalcularse
          en cada cambio de pagina u orden, y mantenerlo montado lo haria. */}
      {showForm && (
        <ChecklistFormModal
          isOpen
          areas={CHECKLIST_AREAS}
          tipos={CHECKLIST_TIPOS}
          estados={CHECKLIST_ESTADOS}
          personalList={personalList}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
