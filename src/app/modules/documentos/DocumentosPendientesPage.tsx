import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert } from '../../shared/components/alert';
import { SearchBar } from '../../shared/components/search-bar';
import { Pagination } from '../../shared/components/pagination';
import { Modal } from '../../shared/components/modal';
import { documentoService } from '../../core/services/documento.service';
import type { ApiError } from '../../core/interceptors/error.interceptor';
import type {
  DocumentoPendienteDto,
  DocumentoPendientesParams,
  EstadoValidacion,
  TipoSujeto,
} from '../../models/documento.model';
import type { PagedResponse } from '../../models/paged-response.model';
import { SUJETO_LABELS } from '../../models/documento.model';
import {
  ESTADO_VALIDACION_LABEL,
  estadoValidacionBadgeClass,
  formatearFecha,
} from './documentos-estado';
import { VisorArchivoModal } from './VisorArchivoModal';
import './documentos-page.css';

const ESTADOS_BANDEJA: EstadoValidacion[] = ['PENDIENTE', 'APROBADO', 'RECHAZADO'];

export function DocumentosPendientesPage() {
  const [params, setParams] = useState<DocumentoPendientesParams>({
    page: 1,
    pageSize: 25,
    search: '',
    tipoSujeto: null,
    estado: 'PENDIENTE',
  });
  const [data, setData] = useState<PagedResponse<DocumentoPendienteDto> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
  const [visorItem, setVisorItem] = useState<DocumentoPendienteDto | null>(null);
  const [rechazo, setRechazo] = useState<number[] | null>(null);
  const [motivo, setMotivo] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const result = await documentoService.getPendientes(params);
        if (!cancelled) {
          setData(result);
          setSelected([]);
        }
      } catch (err) {
        if (!cancelled) {
          setError((err as ApiError).message || 'Error al cargar la bandeja de validación.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [params, reloadKey]);

  const items = data?.items ?? [];
  const todosSeleccionados = items.length > 0 && selected.length === items.length;

  const toggle = (id: number) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleAll = () => {
    setSelected(todosSeleccionados ? [] : items.map((i) => i.idSolicitud));
  };

  const resolver = async (ids: number[], aprobar: boolean, observacion?: string) => {
    if (ids.length === 0) return;
    setProcessing(true);
    setError('');
    try {
      await documentoService.resolverPendientes(ids, aprobar, observacion ?? null);
      setSuccess(
        aprobar
          ? `${ids.length} solicitud(es) aprobada(s).`
          : `${ids.length} solicitud(es) rechazada(s).`,
      );
      setSelected([]);
      setRechazo(null);
      setMotivo('');
      setReloadKey((k) => k + 1);
    } catch (err) {
      setError((err as ApiError).message || 'No se pudo procesar la solicitud.');
    } finally {
      setProcessing(false);
    }
  };

  const confirmarRechazo = () => {
    if (!rechazo || !motivo.trim()) return;
    resolver(rechazo, false, motivo.trim());
  };

  return (
    <div className="documentos-page documentos-pendientes">
      <div className="documentos-page__header">
        <h1 className="documentos-page__title">Bandeja de Validación</h1>
        <div className="documentos-page__header-actions">
          <Link to="/documentos" className="btn btn--secondary">
            Registro documental
          </Link>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      <div className="documentos-page__toolbar">
        <SearchBar
          onSearch={(term) => setParams((prev) => ({ ...prev, page: 1, search: term }))}
          placeholder="Buscar por sujeto, documento o solicitante..."
        />
        <select
          className="documentos-page__filter"
          value={params.tipoSujeto ?? ''}
          onChange={(e) =>
            setParams((prev) => ({
              ...prev,
              page: 1,
              tipoSujeto: (e.target.value || null) as TipoSujeto | null,
            }))
          }
          aria-label="Filtrar por tipo de sujeto"
        >
          <option value="">Todos los sujetos</option>
          {(Object.keys(SUJETO_LABELS) as TipoSujeto[]).map((t) => (
            <option key={t} value={t}>
              {SUJETO_LABELS[t]}
            </option>
          ))}
        </select>
        <select
          className="documentos-page__filter"
          value={params.estado ?? ''}
          onChange={(e) =>
            setParams((prev) => ({
              ...prev,
              page: 1,
              estado: e.target.value as DocumentoPendientesParams['estado'],
            }))
          }
          aria-label="Filtrar por estado"
        >
          {ESTADOS_BANDEJA.map((e) => (
            <option key={e} value={e}>
              {ESTADO_VALIDACION_LABEL[e]}
            </option>
          ))}
        </select>
      </div>

      {selected.length > 0 && (
        <div className="documentos-pendientes__bulk">
          <span>{selected.length} seleccionada(s)</span>
          <button
            type="button"
            className="btn btn--primary btn--sm"
            disabled={processing}
            onClick={() => resolver(selected, true)}
          >
            Aprobar seleccionadas
          </button>
          <button
            type="button"
            className="btn btn--danger btn--sm"
            disabled={processing}
            onClick={() => { setMotivo(''); setRechazo(selected); }}
          >
            Rechazar seleccionadas
          </button>
        </div>
      )}

      {loading && <div className="documentos-page__loading">Cargando...</div>}

      <div className="documentos-pendientes__table-wrapper">
        <table className="documentos-pendientes__table">
          <thead>
            <tr>
              <th className="documentos-pendientes__check">
                <input
                  type="checkbox"
                  checked={todosSeleccionados}
                  onChange={toggleAll}
                  aria-label="Seleccionar todas"
                />
              </th>
              <th>Sujeto</th>
              <th>Tipo de documento</th>
              <th>Nro.</th>
              <th>Solicitante</th>
              <th>Solicitud</th>
              <th>Estado</th>
              <th>Observación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={9} className="documentos-pendientes__empty">
                  {loading ? 'Cargando...' : 'No hay solicitudes para los filtros seleccionados.'}
                </td>
              </tr>
            ) : (
              items.map((p) => (
                <tr key={p.idSolicitud}>
                  <td className="documentos-pendientes__check">
                    <input
                      type="checkbox"
                      checked={selected.includes(p.idSolicitud)}
                      onChange={() => toggle(p.idSolicitud)}
                      aria-label={`Seleccionar solicitud ${p.idSolicitud}`}
                    />
                  </td>
                  <td>
                    <div className="documentos-page__sujeto">
                      <span className="documentos-page__sujeto-codigo">{p.codigoSujeto}</span>
                      {p.nombreSujeto && (
                        <span className="documentos-page__sujeto-nombre">{p.nombreSujeto}</span>
                      )}
                    </div>
                  </td>
                  <td>{p.nombreTipoDocumento ?? '—'}</td>
                  <td>{p.nroDocumento ?? '—'}</td>
                  <td>{p.solicitante ?? '—'}</td>
                  <td>{formatearFecha(p.fechaSolicitud)}</td>
                  <td>
                    <span className={estadoValidacionBadgeClass(p.estado)}>
                      {ESTADO_VALIDACION_LABEL[p.estado]}
                    </span>
                  </td>
                  <td className="documentos-pendientes__obs">{p.observacion ?? '—'}</td>
                  <td className="documentos-pendientes__actions">
                    <button
                      type="button"
                      className="btn btn--secondary btn--sm"
                      onClick={() => setVisorItem(p)}
                    >
                      Ver archivo
                    </button>
                    {p.estado === 'PENDIENTE' && (
                      <>
                        <button
                          type="button"
                          className="btn btn--primary btn--sm"
                          disabled={processing}
                          onClick={() => resolver([p.idSolicitud], true)}
                        >
                          Aprobar
                        </button>
                        <button
                          type="button"
                          className="btn btn--danger btn--sm"
                          disabled={processing}
                          onClick={() => { setMotivo(''); setRechazo([p.idSolicitud]); }}
                        >
                          Rechazar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        page={data?.page ?? 1}
        totalPages={data?.totalPages ?? 1}
        hasPrevious={data?.hasPrevious ?? false}
        hasNext={data?.hasNext ?? false}
        pageSize={params.pageSize}
        onPageSizeChange={(size) => setParams((prev) => ({ ...prev, page: 1, pageSize: size }))}
        onPageChange={(page) => setParams((prev) => ({ ...prev, page }))}
      />

      {visorItem && (
        <VisorArchivoModal
          isOpen
          idDocumentoRegistro={visorItem.idDocumentoRegistro}
          nombreArchivo={visorItem.nombreArchivo ?? null}
          title={`Vista previa · ${visorItem.nombreTipoDocumento ?? 'Documento'}`}
          onClose={() => setVisorItem(null)}
        />
      )}

      {rechazo && (
        <Modal
          isOpen
          title="Rechazar solicitud(es)"
          onClose={() => { setRechazo(null); setMotivo(''); }}
        >
          <div className="documentos-pendientes__rechazo">
            <p className="documentos-pendientes__rechazo-text">
              Indique el motivo del rechazo ({rechazo.length} solicitud(es)).
            </p>
            <textarea
              className="documentos-pendientes__textarea"
              rows={4}
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Motivo del rechazo (obligatorio)..."
            />
            {!motivo.trim() && (
              <span className="documentos-pendientes__hint">El motivo es obligatorio.</span>
            )}
            <div className="documentos-pendientes__rechazo-actions">
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => { setRechazo(null); setMotivo(''); }}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn--danger"
                disabled={!motivo.trim() || processing}
                onClick={confirmarRechazo}
              >
                {processing ? 'Procesando...' : 'Rechazar'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
