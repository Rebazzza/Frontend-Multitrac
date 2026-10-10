import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert } from '../../shared/components/alert';
import { SearchBar } from '../../shared/components/search-bar';
import { Pagination } from '../../shared/components/pagination';
import { DataTable, type Column } from '../../shared/components/data-table';
import { ConfirmDialog } from '../../shared/components/confirm-dialog';
import { documentoService } from '../../core/services/documento.service';
import type { ApiError } from '../../core/interceptors/error.interceptor';
import type {
  DocumentoDto,
  DocumentoListadoDto,
  DocumentoPagedParams,
  TipoSujeto,
} from '../../models/documento.model';
import type { PagedResponse } from '../../models/paged-response.model';
import { SUJETO_LABELS } from '../../models/documento.model';
import { ESTADOS_REGISTRO, tiposPorSujeto } from './documentos-catalogos';
import {
  ESTADO_REGISTRO_LABEL,
  NIVEL_LABEL,
  estadoRegistroBadgeClass,
  formatearFecha,
  formatearNumero,
  getNivelAlerta,
  nivelBadgeClass,
} from './documentos-estado';
import { DocumentoFormModal, type DocumentoFormValues } from './DocumentoFormModal';
import { VisorArchivoModal } from './VisorArchivoModal';
import './documentos-page.css';

export function DocumentosListaPage() {
  const [sujeto, setSujeto] = useState<TipoSujeto>('EQUIPO');
  const [params, setParams] = useState<DocumentoPagedParams>({
    page: 1,
    pageSize: 25,
    search: '',
    idTipoDocumento: null,
    estado: '',
  });
  const [data, setData] = useState<PagedResponse<DocumentoListadoDto> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<DocumentoListadoDto | null>(null);
  const [visorItem, setVisorItem] = useState<DocumentoListadoDto | null>(null);
  const [deleteItem, setDeleteItem] = useState<DocumentoListadoDto | null>(null);

  const tipos = useMemo(() => tiposPorSujeto(sujeto), [sujeto]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const result = await documentoService.getPaged({ ...params, tipoSujeto: sujeto });
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) {
          setError((err as ApiError).message || 'Error al cargar los documentos.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [params, sujeto, reloadKey]);

  const handleSujeto = (nuevo: TipoSujeto) => {
    setSujeto(nuevo);
    setParams((prev) => ({ ...prev, page: 1, idTipoDocumento: null }));
  };

  const columns: Column<DocumentoListadoDto>[] = [
    {
      key: 'codigoSujeto',
      header: 'Sujeto',
      render: (item) => (
        <div className="documentos-page__sujeto">
          <span className="documentos-page__sujeto-codigo">{item.codigoSujeto}</span>
          {item.nombreSujeto && (
            <span className="documentos-page__sujeto-nombre">{item.nombreSujeto}</span>
          )}
        </div>
      ),
    },
    {
      key: 'nombreTipoDocumento',
      header: 'Tipo de documento',
      render: (item) => <span>{item.nombreTipoDocumento ?? '—'}</span>,
    },
    { key: 'nroDocumento', header: 'Nro.', render: (item) => <span>{item.nroDocumento ?? '—'}</span> },
    {
      key: 'fechaExpedicion',
      header: 'Expedición',
      render: (item) => <span>{formatearFecha(item.fechaExpedicion)}</span>,
    },
    {
      key: 'fechaCaducidad',
      header: 'Vencimiento',
      render: (item) => {
        const nivel = getNivelAlerta(item);
        return (
          <span className={nivelBadgeClass(nivel)}>
            {formatearFecha(item.fechaCaducidad)} · {NIVEL_LABEL[nivel]}
          </span>
        );
      },
    },
    {
      key: 'kilometraje',
      header: 'Kilometraje',
      render: (item) => <span>{formatearNumero(item.kilometraje)}</span>,
    },
    {
      key: 'estado',
      header: 'Estado',
      render: (item) => (
        <span className={estadoRegistroBadgeClass(item.estado)}>
          {ESTADO_REGISTRO_LABEL[item.estado]}
        </span>
      ),
    },
  ];

  const handleSubmit = async (values: DocumentoFormValues) => {
    const dto: DocumentoDto = { ...values };
    if (editItem) {
      await documentoService.update(editItem.idDocumentoRegistro, dto);
      setSuccess(`Documento ${values.nroDocumento ?? ''} actualizado.`.trim());
    } else {
      await documentoService.create(dto);
      setSuccess(`Documento ${values.nroDocumento ?? ''} registrado.`.trim());
    }
    setShowForm(false);
    setEditItem(null);
    setReloadKey((k) => k + 1);
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    try {
      await documentoService.remove(deleteItem.idDocumentoRegistro);
      setSuccess('Documento eliminado.');
      setDeleteItem(null);
      setReloadKey((k) => k + 1);
    } catch (err) {
      setError((err as ApiError).message || 'No se pudo eliminar el documento.');
      setDeleteItem(null);
    }
  };

  return (
    <div className="documentos-page">
      <div className="documentos-page__header">
        <h1 className="documentos-page__title">Registro Documental</h1>
        <div className="documentos-page__header-actions">
          <Link to="/documentos/pendientes" className="btn btn--secondary">
            Bandeja de validación
          </Link>
          <button
            type="button"
            className="documentos-page__add"
            onClick={() => { setEditItem(null); setShowForm(true); }}
          >
            Nuevo documento
          </button>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      <div className="documentos-page__tabs" role="tablist">
        {(Object.keys(SUJETO_LABELS) as TipoSujeto[]).map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={sujeto === t}
            className={`documentos-page__tab ${sujeto === t ? 'is-active' : ''}`}
            onClick={() => handleSujeto(t)}
          >
            {SUJETO_LABELS[t]}
          </button>
        ))}
      </div>

      <div className="documentos-page__toolbar">
        <SearchBar
          onSearch={(term) => setParams((prev) => ({ ...prev, page: 1, search: term }))}
          placeholder="Buscar por código, documento o número..."
        />
        <select
          className="documentos-page__filter"
          value={params.idTipoDocumento ?? ''}
          onChange={(e) =>
            setParams((prev) => ({
              ...prev,
              page: 1,
              idTipoDocumento: e.target.value ? Number(e.target.value) : null,
            }))
          }
          aria-label="Filtrar por tipo de documento"
        >
          <option value="">Todos los tipos</option>
          {tipos.map((t) => (
            <option key={t.idTipoDocumento} value={t.idTipoDocumento}>
              {t.nombreTipoDocumento}
            </option>
          ))}
        </select>
        <select
          className="documentos-page__filter"
          value={params.estado ?? ''}
          onChange={(e) => setParams((prev) => ({ ...prev, page: 1, estado: e.target.value as DocumentoPagedParams['estado'] }))}
          aria-label="Filtrar por estado"
        >
          <option value="">Todos los estados</option>
          {ESTADOS_REGISTRO.map((e) => (
            <option key={e.value} value={e.value}>
              {e.label}
            </option>
          ))}
        </select>
      </div>

      {loading && <div className="documentos-page__loading">Cargando...</div>}

      <DataTable
        columns={columns as unknown as Column<Record<string, unknown>>[]}
        data={(data?.items ?? []) as unknown as Record<string, unknown>[]}
        onView={(item) => setVisorItem(item as unknown as DocumentoListadoDto)}
        onEdit={(item) => { setEditItem(item as unknown as DocumentoListadoDto); setShowForm(true); }}
        onDelete={(item) => setDeleteItem(item as unknown as DocumentoListadoDto)}
        viewLabel="Ver archivo"
        emptyMessage={loading ? 'Cargando...' : 'No se encontraron documentos para este sujeto.'}
      />
      <Pagination
        page={data?.page ?? 1}
        totalPages={data?.totalPages ?? 1}
        hasPrevious={data?.hasPrevious ?? false}
        hasNext={data?.hasNext ?? false}
        pageSize={params.pageSize}
        onPageSizeChange={(size) => setParams((prev) => ({ ...prev, page: 1, pageSize: size }))}
        onPageChange={(page) => setParams((prev) => ({ ...prev, page }))}
      />

      {showForm && (
        <DocumentoFormModal
          isOpen
          title={editItem ? 'Editar documento' : 'Registrar documento'}
          sujeto={sujeto}
          initialValues={editItem}
          onSubmit={handleSubmit}
          onCancel={() => { setShowForm(false); setEditItem(null); }}
        />
      )}

      {visorItem && (
        <VisorArchivoModal
          isOpen
          idDocumentoRegistro={visorItem.idDocumentoRegistro}
          nombreArchivo={visorItem.nombreArchivo ?? null}
          title={`Vista previa · ${visorItem.nombreTipoDocumento ?? 'Documento'}`}
          onClose={() => setVisorItem(null)}
        />
      )}

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
