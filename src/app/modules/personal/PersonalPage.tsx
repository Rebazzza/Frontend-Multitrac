import { useEffect, useMemo, useState } from 'react';
import { Alert } from '../../shared/components/alert';
import { SearchBar } from '../../shared/components/search-bar';
import { Pagination } from '../../shared/components/pagination';
import { DataTable, type Column } from '../../shared/components/data-table';
import { personalService } from '../../core/services/personal.service';
import type { PagedParams } from '../../models/paged-params.model';
import type { PagedResponse } from '../../models/paged-response.model';
import type { Personal } from '../../models/personal.model';
import type { PersonalCargo } from '../../models/personal-cargo.model';
import type { ApiError } from '../../core/interceptors/error.interceptor';
import './PersonalPage.css';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getCargoNombre(cargos: any[], idCargo?: number): string {
  if (idCargo == null) return '—';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cargo = (cargos as any[]).find((c) => c.idCargo === idCargo);
  if (!cargo) return String(idCargo);
  return cargo.tituloCargo || cargo.crgNom || cargo.descripcionCargo || String(idCargo);
}

function getNombreCompleto(p: Personal): string {
  return [p.apPersonal, p.amPersonal, p.nomPersonal].filter(Boolean).join(' ').trim() || `Personal ${p.idPersonal}`;
}

function getDocumentosAlDia(p: Personal): boolean {
  const identidad = Boolean(p.dniPersonal) || Boolean(p.pasaportePersonal);
  const licencia = Boolean(p.licPersonal) || Boolean(p.idLicPersonal);
  return identidad && licencia;
}

export function PersonalPage() {
  const [data, setData] = useState<PagedResponse<Personal> | null>(null);
  const [cargos, setCargos] = useState<unknown[]>([]);
  const [cargosPersonal, setCargosPersonal] = useState<PersonalCargo[]>([]);
  const [params, setParams] = useState<PagedParams>({
    page: 1,
    pageSize: 25,
    sortBy: 'apPersonal',
    sortDirection: 'asc',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const loadAux = async () => {
      try {
        const [cargoList, personalCargoList] = await Promise.all([
          personalService.getCargos(),
          personalService.getCargosPersonal(),
        ]);
        if (!cancelled) {
          setCargos(cargoList);
          setCargosPersonal(personalCargoList);
        }
      } catch {
        if (!cancelled) {
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

  const columns: Column<Personal>[] = [
    { key: 'idPersonal', header: 'Código', sortable: true },
    { key: 'nomPersonal', header: 'Conductor', sortable: true, render: (item) => <span>{getNombreCompleto(item)}</span> },
    { key: 'dniPersonal', header: 'DNI', render: (item) => <span>{item.dniPersonal ?? '—'}</span> },
    { key: 'licPersonal', header: 'Licencia', render: (item) => <span>{item.licPersonal ?? '—'}</span> },
    {
      key: 'cargo',
      header: 'Cargo',
      render: (item) => <span>{getCargoNombre(cargos, cargoPorPersonal.get(item.idPersonal))}</span>,
    },
    {
      key: 'documentos',
      header: 'Documentos',
      render: (item) => {
        const alDia = getDocumentosAlDia(item);
        return (
          <span className={`badge ${alDia ? 'badge--success' : 'badge--danger'}`}>
            {alDia ? 'Al día' : 'Vencido'}
          </span>
        );
      },
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
        <h1 className="personal-page__title">Documentos de Personal</h1>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <div className="personal-page__toolbar">
        <SearchBar onSearch={handleSearch} placeholder="Buscar trabajador..." />
      </div>

      {loading && <div className="personal-page__loading">Cargando...</div>}

      <DataTable
        columns={columns as unknown as Column<Record<string, unknown>>[]}
        data={(data?.items ?? []) as unknown as Record<string, unknown>[]}
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