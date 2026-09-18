import { useEffect, useMemo, useState } from 'react';
import { Alert } from '../../shared/components/alert';
import { SearchBar } from '../../shared/components/search-bar';
import { Pagination } from '../../shared/components/pagination';
import { DataTable, type Column } from '../../shared/components/data-table';
import { ConfirmDialog } from '../../shared/components/confirm-dialog';
import { Modal } from '../../shared/components/modal';
import { personalDocumentoService } from '../../core/services/personal-documento.service';
import type { CatalogoPersonalDocumento, CatalogoPersonalPersonal, PersonalDocumentoDto, PersonalDocumentoListadoDto } from '../../models/personal-documento.model';
import type { ApiError } from '../../core/interceptors/error.interceptor';
import { PersonalDocumentoFormModal, type PersonalDocumentoFormValues } from './PersonalDocumentoFormModal';
import './PersonalDocumentoPage.css';

export type NivelAlerta = 'verde' | 'amarillo' | 'naranja' | 'rojo' | 'gris';

function getNivelAlerta(item: PersonalDocumentoListadoDto): NivelAlerta {
  const dias = item.diasParaVencer;
  if (dias == null) {
    const api = item.nivelAlerta;
    if (api === 'verde' || api === 'naranja' || api === 'rojo') return api;
    return 'gris';
  }
  if (dias < 0) return 'rojo';
  if (dias <= 5) return 'rojo';
  if (dias <= 10) return 'naranja';
  if (dias <= 30) return 'amarillo';
  return 'verde';
}

const NIVEL_LABEL: Record<NivelAlerta, string> = {
  verde: 'Al día',
  amarillo: 'Próximo',
  naranja: 'Por vencer',
  rojo: 'Vencido',
  gris: 'Sin vencimiento',
};

function formatFecha(value?: string | null): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function PersonalDocumentoPage() {
  const [items, setItems] = useState<PersonalDocumentoListadoDto[] | null>(null);
  const [documentos, setDocumentos] = useState<CatalogoPersonalDocumento[]>([]);
  const [personales, setPersonales] = useState<CatalogoPersonalPersonal[]>([]);
  const [search, setSearch] = useState('');
  const [filterDocumento, setFilterDocumento] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<PersonalDocumentoListadoDto | null>(null);
  const [deleteItem, setDeleteItem] = useState<PersonalDocumentoListadoDto | null>(null);
  const [viewDetail, setViewDetail] = useState<PersonalDocumentoDto | null>(null);
  const [viewLoading, setViewLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const loadCatalogs = async () => {
      try {
        const [docList, perList] = await Promise.all([
          personalDocumentoService.getCatalogoDocumentos(),
          personalDocumentoService.getCatalogoPersonales(),
        ]);
        if (!cancelled) {
          setDocumentos(docList);
          setPersonales(perList);
        }
      } catch {
        if (!cancelled) {
          setDocumentos([]);
          setPersonales([]);
        }
      }
    };
    loadCatalogs();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      setLoading(true);
      setError('');
      try {
        const result = await personalDocumentoService.getAll();
        if (!cancelled) setItems(result);
      } catch (err) {
        if (!cancelled) {
          const apiError = err as ApiError;
          setError(apiError.message || 'Error al cargar los documentos personales');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetch();
    return () => { cancelled = true; };
  }, [reloadKey]);

  const filtered = useMemo(() => {
    if (!items) return [];
    const term = search.trim().toLowerCase();
    return items.filter((item) => {
      if (filterDocumento && String(item.idDocumento) !== filterDocumento) return false;
      if (filterEstado && (item.estado ?? '') !== filterEstado) return false;
      if (!term) return true;
      return [item.personal, item.nombreDocumento, item.nroDocumento, String(item.idPersonalDocumento)]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(term));
    });
  }, [items, search, filterDocumento, filterEstado]);

  const pagedItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const columns: Column<PersonalDocumentoListadoDto>[] = [
    { key: 'idPersonalDocumento', header: 'ID', render: (item) => <span>{item.idPersonalDocumento}</span> },
    { key: 'personal', header: 'Conductor', render: (item) => <span>{item.personal ?? '—'}</span> },
    { key: 'nombreDocumento', header: 'Documento', render: (item) => <span>{item.nombreDocumento ?? '—'}</span> },
    { key: 'nroDocumento', header: 'Nro. Documento', render: (item) => <span>{item.nroDocumento ?? '—'}</span> },
    { key: 'fechaExpedida', header: 'Fecha Expedida', render: (item) => <span>{formatFecha(item.fechaExpedida)}</span> },
    {
      key: 'fechaCaducidad',
      header: 'Vencimiento',
      render: (item) => {
        const nivel = getNivelAlerta(item);
        return (
          <span className={`badge badge--${nivel}`}>
            {formatFecha(item.fechaCaducidad)} · {NIVEL_LABEL[nivel]}
          </span>
        );
      },
    },
    {
      key: 'estado',
      header: 'Estado',
      render: (item) => (
        <span className={`badge ${item.estado === 'A' ? 'badge--success' : 'badge--neutral'}`}>
          {item.estado === 'A' ? 'Activo' : item.estado === 'I' ? 'Inactivo' : (item.estado ?? '—')}
        </span>
      ),
    },
  ];

  const handleCreate = () => {
    setEditItem(null);
    setShowForm(true);
  };

  const handleEdit = (item: PersonalDocumentoListadoDto) => {
    setEditItem(item);
    setShowForm(true);
  };

  const handleView = async (item: PersonalDocumentoListadoDto) => {
    setViewLoading(true);
    setError('');
    try {
      const detail = await personalDocumentoService.getById(item.idPersonalDocumento);
      setViewDetail(detail);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Error al obtener el detalle del documento');
    } finally {
      setViewLoading(false);
    }
  };

  const handleOpenFile = () => {
    if (!viewDetail?.url) return;
    const raw = viewDetail.url.trim();
    if (/^https?:\/\//i.test(raw)) {
      window.open(raw, '_blank', 'noopener,noreferrer');
      return;
    }
    const normalized = raw.replace(/^\\+/, '').replace(/\\/g, '/');
    window.open(`/${normalized}`, '_blank', 'noopener,noreferrer');
  };

  const handleSubmit = async (values: PersonalDocumentoFormValues) => {
    try {
      const dto = {
        idPersonal: values.idPersonal != null ? Number(values.idPersonal) : null,
        idDocumento: values.idDocumento != null ? Number(values.idDocumento) : null,
        nroDocumento: values.nroDocumento || null,
        fechaExped: values.fechaExped || null,
        fechaVencimiento: values.fechaVencimiento || null,
        estado: values.estado || 'A',
        observacion: values.observacion || null,
      };
      if (editItem) {
        await personalDocumentoService.update(editItem.idPersonalDocumento, dto);
      } else {
        await personalDocumentoService.create(dto);
      }
      setShowForm(false);
      setEditItem(null);
      setReloadKey((k) => k + 1);
    } catch (err) {
      throw err as ApiError;
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    try {
      await personalDocumentoService.remove(deleteItem.idPersonalDocumento);
      setDeleteItem(null);
      setReloadKey((k) => k + 1);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Error al eliminar');
      setDeleteItem(null);
    }
  };

  return (
    <div className="personal-documento-page">
      <div className="personal-documento-page__header">
        <h1 className="personal-documento-page__title">Documentos de Personal</h1>
        <button type="button" className="personal-documento-page__add" onClick={handleCreate}>
          Agregar
        </button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <div className="personal-documento-page__toolbar">
        <SearchBar onSearch={setSearch} placeholder="Buscar documento..." />
        <select
          className="personal-documento-page__filter"
          value={filterDocumento}
          onChange={(e) => { setFilterDocumento(e.target.value); setPage(1); }}
          aria-label="Filtrar por documento"
        >
          <option value="">Todos los documentos</option>
          {documentos.map((doc) => (
            <option key={doc.idDocumento} value={doc.idDocumento}>
              {doc.nombreDocumento?.trim() || `Documento ${doc.idDocumento}`}
            </option>
          ))}
        </select>
        <select
          className="personal-documento-page__filter"
          value={filterEstado}
          onChange={(e) => { setFilterEstado(e.target.value); setPage(1); }}
          aria-label="Filtrar por estado"
        >
          <option value="">Todos los estados</option>
          <option value="A">Activo</option>
          <option value="I">Inactivo</option>
        </select>
      </div>

      {loading && <div className="personal-documento-page__loading">Cargando...</div>}

      <DataTable
        columns={columns as unknown as Column<Record<string, unknown>>[]}
        data={(pagedItems as unknown) as Record<string, unknown>[]}
        onView={(item) => handleView(item as unknown as PersonalDocumentoListadoDto)}
        onEdit={(item) => handleEdit(item as unknown as PersonalDocumentoListadoDto)}
        onDelete={(item) => setDeleteItem(item as unknown as PersonalDocumentoListadoDto)}
        emptyMessage={loading ? 'Cargando...' : 'No se encontraron documentos.'}
      />
      <Pagination
        page={page}
        totalPages={totalPages}
        hasPrevious={page > 1}
        hasNext={page < totalPages}
        pageSize={pageSize}
        onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
        onPageChange={setPage}
      />

      <Modal
        isOpen={!!viewDetail}
        title="Detalle del documento"
        onClose={() => setViewDetail(null)}
      >
        {viewLoading && <div className="personal-documento-page__loading">Cargando...</div>}
        {viewDetail && !viewLoading && (
          <div className="personal-documento-page__detail">
            <p>
              <strong>Documento:</strong> {viewDetail.nroDocumento || '—'}
            </p>
            <p>
              <strong>Archivo:</strong> {viewDetail.nombreArchivo || '—'}
            </p>
            <p>
              <strong>URL / ruta:</strong> {viewDetail.url || '—'}
            </p>
            <p>
              <strong>Observación:</strong> {viewDetail.observacion || '—'}
            </p>
            <p>
              <strong>Estado:</strong>{' '}
              <span className={`badge ${viewDetail.estado === 'A' ? 'badge--success' : 'badge--neutral'}`}>
                {viewDetail.estado === 'A' ? 'Activo' : viewDetail.estado === 'I' ? 'Inactivo' : (viewDetail.estado ?? '—')}
              </span>
            </p>
            <div className="personal-documento-page__detail-actions">
              <button
                type="button"
                className="btn btn--primary"
                onClick={handleOpenFile}
                disabled={!viewDetail.url}
              >
                Abrir documento
              </button>
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => setViewDetail(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </Modal>

      <PersonalDocumentoFormModal
        isOpen={showForm}
        title={editItem ? 'Editar documento' : 'Nuevo documento'}
        personales={personales}
        documentos={documentos}
        initialValues={editItem}
        onSubmit={handleSubmit}
        onCancel={() => { setShowForm(false); setEditItem(null); }}
      />

      <ConfirmDialog
        isOpen={!!deleteItem}
        title="Eliminar documento"
        message="¿Está seguro de eliminar este documento? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteItem(null)}
      />
    </div>
  );
}