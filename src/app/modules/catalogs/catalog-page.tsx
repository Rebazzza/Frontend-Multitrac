import { useState, useEffect } from 'react';
import { DataTable, type Column } from '../../shared/components/data-table';
import { Pagination } from '../../shared/components/pagination';
import { SearchBar } from '../../shared/components/search-bar';
import { ConfirmDialog } from '../../shared/components/confirm-dialog';
import { Alert } from '../../shared/components/alert';
import type { PagedResponse } from '../../models/paged-response.model';
import type { PagedParams } from '../../models/paged-params.model';
import type { ApiError } from '../../core/interceptors/error.interceptor';
import { CatalogForm } from './catalog-form';
import type { FieldConfig } from './catalog-config';
import './catalog-page.css';

interface CatalogPageProps {
  title: string;
  columns: Column<Record<string, unknown>>[];
  fields: FieldConfig[];
  defaultSort?: string;
  getPaged: (params: PagedParams) => Promise<PagedResponse<unknown>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  create: (dto: any) => Promise<unknown>;
  update: (id: number, dto: unknown) => Promise<void>;
  remove: (id: number) => Promise<void>;
  idKey: string;
}

export function CatalogPage({
  title,
  columns,
  fields,
  defaultSort,
  getPaged,
  create,
  update,
  remove,
  idKey,
}: CatalogPageProps) {
  const [data, setData] = useState<PagedResponse<unknown> | null>(null);
  const [params, setParams] = useState<PagedParams>({
    page: 1,
    pageSize: 25,
    sortBy: defaultSort,
    sortDirection: 'asc',
  });
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Record<string, unknown> | null>(null);
  const [deleteItem, setDeleteItem] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      setLoading(true);
      setError('');
      try {
        const result = await getPaged(params);
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) {
          const apiError = err as ApiError;
          setError(apiError.message || 'Error al cargar datos');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetch();
    return () => { cancelled = true; };
  }, [getPaged, params, reloadKey]);

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

  const handleEdit = (item: Record<string, unknown>) => {
    setEditItem(item);
    setShowForm(true);
  };

  const handleFormSubmit = async (values: Record<string, unknown>) => {
    try {
      if (editItem) {
        const id = editItem[idKey] as number;
        await update(id, values);
      } else {
        await create(values);
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
    const id = deleteItem[idKey] as number;
    try {
      await remove(id);
      setDeleteItem(null);
      setReloadKey((k) => k + 1);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Error al eliminar');
      setDeleteItem(null);
    }
  };

  return (
    <div className="catalog-page">
      <div className="catalog-page__header">
        <h1 className="catalog-page__title">{title}</h1>
        <button type="button" className="catalog-page__add" onClick={handleCreate}>
          Agregar
        </button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <div className="catalog-page__toolbar">
        <SearchBar onSearch={handleSearch} placeholder={`Buscar ${title.toLowerCase()}...`} />
      </div>

      {loading && <div className="catalog-page__loading">Cargando...</div>}

      <DataTable
        columns={columns}
        data={(data?.items ?? []) as Record<string, unknown>[]}
        onEdit={handleEdit}
        onDelete={(item) => setDeleteItem(item as Record<string, unknown>)}
        onSort={handleSort}
        sortBy={params.sortBy}
        sortDirection={params.sortDirection}
        emptyMessage={
          loading ? 'Cargando...' : `No se encontraron ${title.toLowerCase()}.`
        }
      />
      <Pagination
        page={data?.page ?? 1}
        totalPages={data?.totalPages ?? 1}
        hasPrevious={data?.hasPrevious ?? false}
        hasNext={data?.hasNext ?? false}
        pageSize={params.pageSize}
        onPageSizeChange={handlePageSizeChange}
        onPageChange={handlePageChange}
      />

      {showForm && (
        <CatalogForm
          title={editItem ? `Editar ${title}` : `Nuevo ${title}`}
          fields={fields}
          initialValues={editItem}
          onSubmit={handleFormSubmit}
          onCancel={() => { setShowForm(false); setEditItem(null); }}
        />
      )}

      <ConfirmDialog
        isOpen={!!deleteItem}
        title={`Eliminar ${title}`}
        message={`¿Está seguro de eliminar este registro? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteItem(null)}
      />
    </div>
  );
}
