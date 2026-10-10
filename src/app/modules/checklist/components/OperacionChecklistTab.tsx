import { useEffect, useMemo, useState } from 'react';
import { Alert } from '../../../shared/components/alert';
import { SearchBar } from '../../../shared/components/search-bar';
import { Pagination } from '../../../shared/components/pagination';
import { DataTable, type Column } from '../../../shared/components/data-table';
import httpService from '../../../core/services/http.service';
import { checklistService } from '../../../core/services/checklist.service';
import { formatFecha } from '../../../core/utils/format';
import type { Personal } from '../../../models/personal.model';
import type {
  ChecklistEstado,
  OperacionChecklistHistorialDto,
} from '../../../models/checklist.model';
import { AREA_MANTENIMIENTO, AREA_SEGURIDAD_PDP } from '../../../models/checklist.model';
import { normalizarEstado } from './checklist-estado';

interface FilaOperacionEquipo {
  idOperacionGeneralEquipo: number;
  codEquipoTracto?: string | null;
  codEquipoCarreta?: string | null;
  rolEquipo?: string | null;
  fecha?: string | null;
}

interface OperacionChecklistTabProps {
  estados: ChecklistEstado[];
  personalList: Personal[];
  onSaved?: () => void;
}

const PAGE_SIZE = 10;

const AREAS = [
  { value: AREA_MANTENIMIENTO, label: 'Mantenimiento' },
  { value: AREA_SEGURIDAD_PDP, label: 'Seguridad y PdP' },
];

function toList(data: unknown): Record<string, unknown>[] {
  if (Array.isArray(data)) return data as Record<string, unknown>[];
  if (data && typeof data === 'object' && Array.isArray((data as { value?: unknown }).value)) {
    return (data as { value: Record<string, unknown>[] }).value;
  }
  return [];
}

function nombrePersonal(personalPorId: Map<number, Personal>, id?: number | null): string {
  if (id == null) return '—';
  const p = personalPorId.get(id);
  if (!p) return String(id);
  return (
    [p.apPersonal, p.amPersonal, p.nomPersonal].filter(Boolean).join(' ').trim() ||
    `Personal ${p.idPersonal}`
  );
}

/**
 * Revisiones continuas en ruta. A diferencia del resto del modulo, no escribe en CHECKLIST
 * sino en OPERACION_GENERAL_EQUIPO_CHECKLIST_MANTTO / _PDP, que son las tablas con historial
 * real por operacion (CHECKLIST.IdOperacionGeneralEquipo esta en NULL en las 14.335 filas).
 */
export function OperacionChecklistTab({ estados, personalList, onSaved }: OperacionChecklistTabProps) {
  const [tipoArea, setTipoArea] = useState(AREA_MANTENIMIENTO);
  const [busqueda, setBusqueda] = useState('');
  const [operaciones, setOperaciones] = useState<FilaOperacionEquipo[]>([]);
  const [idOge, setIdOge] = useState('');
  const [historial, setHistorial] = useState<OperacionChecklistHistorialDto[]>([]);
  const [pagina, setPagina] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [loadingHistorial, setLoadingHistorial] = useState(false);
  const [saving, setSaving] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const personalPorId = useMemo(() => {
    const map = new Map<number, Personal>();
    for (const p of personalList) map.set(p.idPersonal, p);
    return map;
  }, [personalList]);

  const estadosPorId = useMemo(() => {
    const map = new Map<number, ChecklistEstado>();
    for (const e of estados) map.set(e.idEstadoCheckList, e);
    return map;
  }, [estados]);

  // Se pagina el lado del servidor: OPERACION_GENERAL_EQUIPO tiene ~50.000 filas.
  // Los resets de los resultados viven en los handlers, no aqui, para no disparar un
  // render en cascada cada vez que la busqueda queda vacia.
  const busquedaActiva = busqueda.trim();

  useEffect(() => {
    if (!busquedaActiva) return;
    let cancelled = false;
    httpService
      .get<unknown>('/OperacionGeneralEquipo/paged', {
        params: { page: 1, pageSize: 25, search: busquedaActiva, sortDirection: 'desc' },
      })
      .then((res) => {
        if (cancelled) return;
        setOperaciones(toList(res.data).map((o) => o as unknown as FilaOperacionEquipo));
      })
      .catch(() => { if (!cancelled) setOperaciones([]); })
      .finally(() => { if (!cancelled) setBuscando(false); });
    return () => { cancelled = true; };
  }, [busquedaActiva]);

  useEffect(() => {
    if (!idOge) return;
    let cancelled = false;
    checklistService
      .getHistorialOperacion(Number(idOge), tipoArea)
      .then((data) => {
        if (cancelled) return;
        setHistorial(data);
        setPagina(1);
      })
      .catch((err) => {
        if (cancelled) return;
        setHistorial([]);
        setError((err as { message?: string })?.message || 'Error al cargar el historial.');
      })
      .finally(() => { if (!cancelled) setLoadingHistorial(false); });
    return () => { cancelled = true; };
  }, [idOge, tipoArea, reloadKey]);

  const handleBuscarOperacion = (texto: string) => {
    setBusqueda(texto);
    if (texto.trim()) {
      setBuscando(true);
    } else {
      setBuscando(false);
      setOperaciones([]);
      setIdOge('');
      setHistorial([]);
    }
  };

  const handleSeleccionOperacion = (valor: string) => {
    setIdOge(valor);
    setHistorial([]);
    setPagina(1);
    setError('');
    if (valor) setLoadingHistorial(true);
  };

  const handleCambioArea = (valor: number) => {
    setTipoArea(valor);
    setIdOge('');
    setHistorial([]);
    setPagina(1);
    setLoadingHistorial(false);
  };

  const agregarFila = () => {
    setHistorial((prev) => [
      ...prev,
      {
        idCheckList: 0,
        idOperacionGeneralEquipo: Number(idOge),
        tipoArea,
        tipoChecklist: tipoArea === AREA_SEGURIDAD_PDP ? 'pdp' : 'mantto',
        idPersonal: null,
        personal: null,
        fechaRevision: new Date().toISOString().slice(0, 10),
        horaRevision: new Date().toTimeString().slice(0, 5),
        idEstadoCheckList: null,
        estadoCheckList: null,
        observaciones: '',
      },
    ]);
  };

  const actualizarFila = (indice: number, cambios: Partial<OperacionChecklistHistorialDto>) => {
    setHistorial((prev) =>
      prev.map((f, i) => {
        if (i !== indice) return f;
        const siguiente = { ...f, ...cambios };
        const estado = siguiente.idEstadoCheckList != null
          ? estadosPorId.get(siguiente.idEstadoCheckList)
          : undefined;
        return { ...siguiente, estadoCheckList: estado?.estadoCheckList ?? null };
      }),
    );
  };

  const eliminarFila = (indice: number) => {
    setHistorial((prev) => prev.filter((_, i) => i !== indice));
  };

  const totalPaginas = Math.max(1, Math.ceil(historial.length / PAGE_SIZE));
  const paginaValida = Math.min(pagina, totalPaginas);
  const filasPagina = historial.slice((paginaValida - 1) * PAGE_SIZE, paginaValida * PAGE_SIZE);

  const columns = useMemo<Column<OperacionChecklistHistorialDto>[]>(
    () => [
      {
        key: 'fechaRevision',
        header: 'Fecha',
        render: (f) => <span>{formatFecha(f.fechaRevision)}</span>,
      },
      {
        key: 'horaRevision',
        header: 'Hora',
        render: (f) => <span>{f.horaRevision ?? '—'}</span>,
      },
      {
        key: 'idPersonal',
        header: 'Personal',
        render: (f) => <span>{nombrePersonal(personalPorId, f.idPersonal)}</span>,
      },
      {
        key: 'idEstadoCheckList',
        header: 'Estado',
        render: (f) => {
          const etiqueta = normalizarEstado(
            f.estadoCheckList ?? estadosPorId.get(f.idEstadoCheckList ?? -1)?.estadoCheckList,
          );
          return (
            <span className={`checklist-badge checklist-badge--${(f.estadoCheckList ?? '').toLowerCase()}`}>
              {etiqueta}
            </span>
          );
        },
      },
      {
        key: 'observaciones',
        header: 'Observaciones',
        render: (f) => <span>{f.observaciones ?? '—'}</span>,
      },
      {
        key: 'acciones',
        header: 'Editar',
        render: (f, ) => <span className="checklist-op__hint">{f.idCheckList === 0 ? 'Nueva' : `#${f.idCheckList}`}</span>,
      },
    ],
    [personalPorId, estadosPorId],
  );

  const handleGuardar = async () => {
    setError('');
    setSuccess('');

    if (!idOge) { setError('Seleccione una operacion de equipo.'); return; }
    if (historial.length === 0) { setError('Agregue al menos una revision.'); return; }
    if (historial.some((f) => !f.idEstadoCheckList)) {
      setError('Todas las revisiones necesitan un estado.');
      return;
    }

    setSaving(true);
    try {
      await checklistService.guardarHistorialOperacion(
        historial.map((f) => ({
          ...f,
          fechaRevision: f.fechaRevision ? `${f.fechaRevision}T00:00:00` : null,
        })),
      );
      setSuccess('Revisiones guardadas correctamente.');
      setLoadingHistorial(true);
      setReloadKey((k) => k + 1);
      onSaved?.();
    } catch (err) {
      setError((err as { message?: string })?.message || 'Error al guardar las revisiones.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="checklist-op">
      <div className="checklist-op__filtros">
        <div className="checklist-op__campo">
          <label htmlFor="tipoArea">Area</label>
          <select
            id="tipoArea"
            value={tipoArea}
            onChange={(e) => handleCambioArea(Number(e.target.value))}
          >
            {AREAS.map((a) => (
              <option key={a.value} value={a.value}>{a.label}</option>
            ))}
          </select>
        </div>

        <div className="checklist-op__campo checklist-op__campo--busqueda">
          <label htmlFor="busquedaOge">Operacion de equipo</label>
          <SearchBar
            onSearch={handleBuscarOperacion}
            placeholder="Buscar por codigo de tracto o carreta..."
          />
          {operaciones.length > 0 && (
            <select
              id="idOge"
              value={idOge}
              onChange={(e) => handleSeleccionOperacion(e.target.value)}
              size={6}
            >
              <option value="">Seleccione una operacion...</option>
              {operaciones.map((o) => {
                const partes = [`#${o.idOperacionGeneralEquipo}`];
                const cods = [o.codEquipoTracto, o.codEquipoCarreta].filter(Boolean).join(' / ');
                if (cods) partes.push(cods);
                if (o.rolEquipo) partes.push(o.rolEquipo);
                return (
                  <option key={o.idOperacionGeneralEquipo} value={o.idOperacionGeneralEquipo}>
                    {partes.join(' · ')}
                  </option>
                );
              })}
            </select>
          )}
          {buscando && <span className="checklist-op__hint">Buscando...</span>}
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      <div className="checklist-op__acciones">
        <button
          type="button"
          className="btn btn--secondary"
          onClick={agregarFila}
          disabled={!idOge}
        >
          Agregar revision
        </button>
        <button
          type="button"
          className="btn btn--primary"
          onClick={handleGuardar}
          disabled={!idOge || historial.length === 0 || saving}
        >
          {saving ? 'Guardando...' : 'Guardar revisiones'}
        </button>
      </div>

      {loadingHistorial ? (
        <div className="checklist-op__hint">Cargando historial...</div>
      ) : (
        <>
          <DataTable
            columns={columns as unknown as Column<Record<string, unknown>>[]}
            data={filasPagina as unknown as Record<string, unknown>[]}
            emptyMessage={idOge ? 'Sin revisiones para esta operacion.' : 'Seleccione una operacion.'}
          />
          <Pagination
            page={paginaValida}
            totalPages={totalPaginas}
            hasPrevious={paginaValida > 1}
            hasNext={paginaValida < totalPaginas}
            pageSize={PAGE_SIZE}
            onPageSizeChange={() => undefined}
            onPageChange={setPagina}
          />
        </>
      )}

      {/* Editor del lote: cada fila se guarda con idCheckList = 0 (alta) o su id (update). */}
      {historial.length > 0 && (
        <div className="checklist-op__editor">
          <h3 className="checklist-op__editor-title">Detalle de revisiones</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Personal</th>
                <th>Estado</th>
                <th>Observaciones</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {historial.map((f, i) => (
                <tr key={`${f.idCheckList}-${i}`}>
                  <td>
                    <input
                      type="date"
                      value={f.fechaRevision ? f.fechaRevision.slice(0, 10) : ''}
                      onChange={(e) => actualizarFila(i, { fechaRevision: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="time"
                      value={f.horaRevision ?? ''}
                      onChange={(e) => actualizarFila(i, { horaRevision: e.target.value })}
                    />
                  </td>
                  <td>
                    <select
                      value={f.idPersonal ?? ''}
                      onChange={(e) => actualizarFila(i, { idPersonal: e.target.value ? Number(e.target.value) : null })}
                    >
                      <option value="">Seleccione...</option>
                      {[...personalPorId.values()].map((p) => (
                        <option key={p.idPersonal} value={p.idPersonal}>
                          {nombrePersonal(personalPorId, p.idPersonal)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select
                      value={f.idEstadoCheckList ?? ''}
                      onChange={(e) => actualizarFila(i, {
                        idEstadoCheckList: e.target.value ? Number(e.target.value) : null,
                      })}
                    >
                      <option value="">Seleccione...</option>
                      {estados.map((s) => (
                        <option key={s.idEstadoCheckList} value={s.idEstadoCheckList}>
                          {normalizarEstado(s.estadoCheckList)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={f.observaciones ?? ''}
                      onChange={(e) => actualizarFila(i, { observaciones: e.target.value })}
                      maxLength={300}
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn--danger btn--sm"
                      onClick={() => eliminarFila(i)}
                    >
                      Quitar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
