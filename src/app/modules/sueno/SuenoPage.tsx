import { useEffect, useState } from 'react';
import { Alert } from '../../shared/components/alert';
import { SearchBar } from '../../shared/components/search-bar';
import { Pagination } from '../../shared/components/pagination';
import { DataTable, type Column } from '../../shared/components/data-table';
import { ConfirmDialog } from '../../shared/components/confirm-dialog';
import { suenoService } from '../../core/services/sueno.service';
import { personalService } from '../../core/services/personal.service';
import type { PagedParams } from '../../models/paged-params.model';
import type { PagedResponse } from '../../models/paged-response.model';
import type { PersonalSueno } from '../../models/personal-sueno.model';
import type { Personal } from '../../models/personal.model';
import type { ApiError } from '../../core/interceptors/error.interceptor';
import { SuenoFormModal, type SuenoFormValues } from './SuenoFormModal';
import './SuenoPage.css';

function getNombrePersonal(personalList: Personal[], idPersonal?: number | null): string {
  const p = personalList.find((item) => item.idPersonal === idPersonal);
  if (!p) return idPersonal != null ? String(idPersonal) : '—';
  return [p.apPersonal, p.amPersonal, p.nomPersonal].filter(Boolean).join(' ').trim() || `Personal ${p.idPersonal}`;
}

function formatFecha(value?: string | null): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function SuenoPage() {
  const [data, setData] = useState<PagedResponse<PersonalSueno> | null>(null);
  const [personalList, setPersonalList] = useState<Personal[]>([]);
  const [params, setParams] = useState<PagedParams>({
    page: 1,
    pageSize: 25,
    sortBy: 'fecha',
    sortDirection: 'desc',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<PersonalSueno | null>(null);
  const [deleteItem, setDeleteItem] = useState<PersonalSueno | null>(null);

  useEffect(() => {
    let cancelled = false;
    personalService.getAll()
      .then((list) => { if (!cancelled) setPersonalList(list); })
      .catch(() => { if (!cancelled) setPersonalList([]); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      setLoading(true);
      setError('');
      try {
        const result = await suenoService.getPaged(params);
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) {
          const apiError = err as ApiError;
          setError(apiError.message || 'Error al cargar los registros de sueño');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetch();
    return () => { cancelled = true; };
  }, [params, reloadKey]);

  const columns: Column<PersonalSueno>[] = [
    { key: 'idSueno', header: 'ID', sortable: true },
    {
      key: 'idPersonal',
      header: 'Conductor',
      render: (item) => <span>{getNombrePersonal(personalList, item.idPersonal)}</span>,
    },
    { key: 'idEmpresa', header: 'Empresa', render: (item) => <span>{item.idEmpresa ?? '—'}</span> },
    { key: 'idOperacionGeneral', header: 'Operación', render: (item) => <span>{item.idOperacionGeneral ?? '—'}</span> },
    { key: 'fecha', header: 'Fecha', sortable: true, render: (item) => <span>{formatFecha(item.fecha)}</span> },
    { key: 'sueno', header: 'Horas', render: (item) => <span>{item.sueno ?? '—'}</span> },
    { key: 'observaciones', header: 'Observaciones', render: (item) => <span>{item.observaciones ?? '—'}</span> },
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

  const handleCreate = () => {
    setEditItem(null);
    setShowForm(true);
  };

  const handleEdit = (item: PersonalSueno) => {
    setEditItem(item);
    setShowForm(true);
  };

  const handleSubmit = async (values: SuenoFormValues) => {
    try {
      if (editItem) {
        await suenoService.update(editItem.idSueno, { ...editItem, ...values });
      } else {
        await suenoService.create(values);
      }
      setShowForm(false);
      setEditItem(null);
      setReloadKey((k) => k + 1);
    } catch (err) {
      const apiError = err as ApiError;
      throw apiError;
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    try {
      await suenoService.remove(deleteItem.idSueno);
      setDeleteItem(null);
      setReloadKey((k) => k + 1);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Error al eliminar');
      setDeleteItem(null);
    }
  };

  return (
    <div className="sueno-page">
      <div className="sueno-page__header">
        <h1 className="sueno-page__title">Registro de Sueño</h1>
        <button type="button" className="sueno-page__add" onClick={handleCreate}>
          Agregar
        </button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <div className="sueno-page__toolbar">
        <SearchBar onSearch={handleSearch} placeholder="Buscar registros..." />
      </div>

      {loading && <div className="sueno-page__loading">Cargando...</div>}

      <DataTable
        columns={columns as unknown as Column<Record<string, unknown>>[]}
        data={(data?.items ?? []) as unknown as Record<string, unknown>[]}
        onEdit={(item) => handleEdit(item as unknown as PersonalSueno)}
        onDelete={(item) => setDeleteItem(item as unknown as PersonalSueno)}
        onSort={handleSort}
        sortBy={params.sortBy}
        sortDirection={params.sortDirection}
        emptyMessage={loading ? 'Cargando...' : 'No se encontraron registros de sueño.'}
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

      <SuenoFormModal
        isOpen={showForm}
        title={editItem ? 'Editar registro de sueño' : 'Nuevo registro de sueño'}
        personalList={personalList}
        initialValues={editItem}
        onSubmit={handleSubmit}
        onCancel={() => { setShowForm(false); setEditItem(null); }}
      />

      <ConfirmDialog
        isOpen={!!deleteItem}
        title="Eliminar registro"
        message="¿Está seguro de eliminar este registro de sueño? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteItem(null)}
      />
    </div>
  );
}