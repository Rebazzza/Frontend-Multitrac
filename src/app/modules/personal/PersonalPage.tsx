import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert } from '../../shared/components/alert';
import { SearchBar } from '../../shared/components/search-bar';
import { Pagination } from '../../shared/components/pagination';
import { DataTable, type Column } from '../../shared/components/data-table';
import { personalService } from '../../core/services/personal.service';
import type { PagedParams } from '../../models/paged-params.model';
import type { PagedResponse } from '../../models/paged-response.model';
import type { Personal } from '../../models/personal.model';
import type { PersonalCargo } from '../../models/personal-cargo.model';
import type { Contratista } from '../../models/contratista.model';
import type { ApiError } from '../../core/interceptors/error.interceptor';
import './PersonalPage.css';

const STATUS_FILTERS = [
  { value: '', label: 'Todos' },
  { value: '0', label: 'Activos' },
  { value: '1', label: 'Inactivos' },
];

function getNombreCompleto(p: Personal): string {
  return [p.apPersonal, p.amPersonal, p.nomPersonal].filter(Boolean).join(' ').trim() || `Personal ${p.idPersonal}`;
}

function getContratistaNombre(c: Contratista | undefined, id: number | undefined): string {
  if (c == null) return id != null ? `#${id}` : '—';
  return (
    c.razonSocialContratista ||
    [c.apContratista, c.amContratista, c.nomContratista].filter(Boolean).join(' ').trim() ||
    `#${c.idContratista}`
  );
}

export function PersonalPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<PagedResponse<Personal> | null>(null);
  const [contratistas, setContratistas] = useState<Contratista[]>([]);
  const [cargos, setCargos] = useState<Record<string, unknown>[]>([]);
  const [cargosPersonal, setCargosPersonal] = useState<PersonalCargo[]>([]);
  const [params, setParams] = useState<PagedParams>({
    page: 1,
    pageSize: 25,
    sortBy: 'apPersonal',
    sortDirection: 'asc',
  });
  const [statusFilter, setStatusFilter] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const loadAux = async () => {
      try {
        const [contratistaList, cargoList, personalCargoList] = await Promise.all([
          personalService.getContratistas(),
          personalService.getCargos(),
          personalService.getCargosPersonal(),
        ]);
        if (!cancelled) {
          setContratistas(contratistaList);
          setCargos(cargoList);
          setCargosPersonal(personalCargoList);
        }
      } catch {
        if (!cancelled) {
          setContratistas([]);
          setCargos([]);
          setCargosPersonal([]);
        }
      }
    };
    loadAux();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      setLoading(true);
      setError('');
      try {
        const result = await personalService.getPaged(params);
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) {
          const apiError = err as ApiError;
          setError(apiError.message || 'Error al cargar el personal');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetch();
    return () => { cancelled = true; };
  }, [params]);

  const contratistaPorId = useMemo(() => {
    const map = new Map<number, Contratista>();
    for (const c of contratistas) map.set(c.idContratista, c);
    return map;
  }, [contratistas]);

  const cargoPorPersonal = useMemo(() => {
    const map = new Map<number, number>();
    for (const pc of cargosPersonal) {
      const actual = pc.fechaFinCargo == null || pc.fechaFinCargo === '';
      const existe = map.has(pc.idPersonal);
      if (!existe) {
        if (actual || !pc.fechaFinCargo) map.set(pc.idPersonal, pc.idCargo);
      } else if (actual) {
        map.set(pc.idPersonal, pc.idCargo);
      }
    }
    return map;
  }, [cargosPersonal]);

  const cargoNombre = (idCargo?: number): string => {
    if (idCargo == null) return '—';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const c = cargos.find((c: any) => Number(c.idCargo) === Number(idCargo));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return c ? ((c as any).tituloCargo || (c as any).crgNom || String(idCargo)) : String(idCargo);
  };

  const filteredItems = useMemo(() => {
    const items = data?.items ?? [];
    if (statusFilter === '') return items;
    return items.filter((p) => String(p.statusOp ?? 0) === statusFilter);
  }, [data, statusFilter]);

  const columns: Column<Personal>[] = [
    { key: 'idPersonal', header: 'Código', sortable: true },
    { key: 'nomPersonal', header: 'Personal', sortable: true, render: (item) => <span>{getNombreCompleto(item)}</span> },
    { key: 'dniPersonal', header: 'DNI', render: (item) => <span>{item.dniPersonal || '—'}</span> },
    { key: 'idContratista', header: 'Contratista', render: (item) => <span>{getContratistaNombre(contratistaPorId.get(item.idContratista ?? -1), item.idContratista ?? undefined)}</span> },
    { key: 'cargo', header: 'Cargo', render: (item) => <span>{cargoNombre(cargoPorPersonal.get(item.idPersonal))}</span> },
    {
      key: 'statusOp',
      header: 'Estado',
      render: (item) => (
        <span className={`badge ${(item.statusOp ?? 0) === 0 ? 'badge--success' : 'badge--danger'}`}>
          {(item.statusOp ?? 0) === 0 ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
  ];

  const handleSearch = (search: string) => {
    setParams((prev) => ({ ...prev, search, page: 1 }));
  };

  const handleSort = (key: string) => {
    setParams((prev) => ({
      ...prev,
      sortBy: key,
      sortDirection: prev.sortBy === key && prev.sortDirection === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    setParams((prev) => ({ ...prev, pageSize, page: 1 }));
  };

  return (
    <div className="personal-page">
      <div className="personal-page__header">
        <h1 className="personal-page__title">Personal</h1>
        <button type="button" className="catalog-page__add" onClick={() => navigate('/personal/nuevo')}>
          Registrar Personal
        </button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <div className="personal-page__toolbar">
        <SearchBar onSearch={handleSearch} placeholder="Buscar trabajador..." />
        <div className="personal-page__filters">
          <select
            className="personal-page__filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filtrar por estado"
          >
            {STATUS_FILTERS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      {loading && <div className="personal-page__loading">Cargando...</div>}

      <DataTable
        columns={columns as unknown as Column<Record<string, unknown>>[]}
        data={filteredItems as unknown as Record<string, unknown>[]}
        onView={(item) => navigate(`/personal/${(item as unknown as Personal).idPersonal}`)}
        onEdit={(item) => navigate(`/personal/${(item as unknown as Personal).idPersonal}`)}
        onSort={handleSort}
        sortBy={params.sortBy}
        sortDirection={params.sortDirection}
        emptyMessage={loading ? 'Cargando...' : 'No se encontraron trabajadores.'}
      />
      <Pagination
        page={data?.page ?? 1}
        totalPages={data?.totalPages ?? 1}
        hasPrevious={data?.hasPrevious ?? false}
        hasNext={data?.hasNext ?? false}
        pageSize={params.pageSize ?? 25}
        onPageSizeChange={handlePageSizeChange}
        onPageChange={handlePageChange}
      />
    </div>
  );
}