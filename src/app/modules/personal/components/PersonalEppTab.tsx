import { useEffect, useMemo, useState } from 'react';
import { Alert } from '../../../shared/components/alert';
import { DataTable, type Column } from '../../../shared/components/data-table';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog';
import { Modal } from '../../../shared/components/modal';
import { FormField } from '../../../shared/components/form-field';
import { personalEppService, personalEppKardexService } from '../../../core/services/personal-epp.service';
import type { PersonalEpp, PersonalEppKardex } from '../../../models/personal-epp.model';
import type { ApiError } from '../../../core/interceptors/error.interceptor';
import { formatFecha, toApiDate, toDateInput } from '../../../core/utils/format';

interface Props {
  personalId: number;
}

const num = (v: string): number | null => (v === '' ? null : Number(v));

export function PersonalEppTab({ personalId }: Props) {
  const [eppList, setEppList] = useState<PersonalEpp[]>([]);
  const [kardexList, setKardexList] = useState<PersonalEppKardex[]>([]);
  const [showEpp, setShowEpp] = useState(false);
  const [editEpp, setEditEpp] = useState<PersonalEpp | null>(null);
  const [deleteEpp, setDeleteEpp] = useState<PersonalEpp | null>(null);
  const [showKardex, setShowKardex] = useState(false);
  const [deleteKardex, setDeleteKardex] = useState<PersonalEppKardex | null>(null);
  const [formEpp, setFormEpp] = useState<Partial<PersonalEpp>>({});
  const [formKardex, setFormKardex] = useState<Partial<PersonalEppKardex>>({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [e, k] = await Promise.all([personalEppService.getAll(), personalEppKardexService.getAll()]);
      setEppList(e);
      setKardexList(k);
    } catch (err) {
      const api = err as ApiError;
      setError(api.message || 'Error al cargar EPP');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      try {
        const [e, k] = await Promise.all([personalEppService.getAll(), personalEppKardexService.getAll()]);
        if (!cancelled) {
          setError('');
          setEppList(e);
          setKardexList(k);
        }
      } catch (err) {
        if (!cancelled) setError((err as ApiError).message || 'Error al cargar EPP');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void fetch();
    return () => { cancelled = true; };
  }, []);

  const eppDePersonal = useMemo(
    () => eppList.filter((e) => String(e.idPersonal) === String(personalId)),
    [eppList, personalId],
  );

  const eppIds = useMemo(() => new Set(eppDePersonal.map((e) => e.idPersonalEpp)), [eppDePersonal]);

  const kardexDePersonal = useMemo(
    () => kardexList.filter((k) => k.idPersonalEpp != null && eppIds.has(k.idPersonalEpp)),
    [kardexList, eppIds],
  );

  const getEppNombre = (id?: number | null): string => {
    if (id == null) return '—';
    const e = eppList.find((x) => x.idPersonalEpp === id);
    if (!e) return `#${id}`;
    return [e.talla, e.observacion].filter(Boolean).join(' - ') || `EPP #${e.idPersonalEpp}`;
  };

  const columnsEpp: Column<PersonalEpp>[] = [
    { key: 'idPersonalEpp', header: 'ID' },
    { key: 'idRequerimientoGeneral', header: 'Requerimiento' },
    { key: 'talla', header: 'Talla' },
    { key: 'observacion', header: 'Observación' },
    { key: 'estado', header: 'Estado' },
  ];

  const columnsKardex: Column<PersonalEppKardex>[] = [
    { key: 'idPersonalEppKardex', header: 'ID' },
    { key: 'idPersonalEpp', header: 'EPP', render: (i) => <span>{getEppNombre(i.idPersonalEpp)}</span> },
    { key: 'fechaEntrega', header: 'Entrega', render: (i) => <span>{formatFecha(i.fechaEntrega)}</span> },
    { key: 'fechaRevision', header: 'Revisión', render: (i) => <span>{formatFecha(i.fechaRevision)}</span> },
    { key: 'fechaReposicion', header: 'Reposición', render: (i) => <span>{formatFecha(i.fechaReposicion)}</span> },
    { key: 'cantidad', header: 'Cantidad' },
    { key: 'estado', header: 'Estado' },
  ];

  const openCreateEpp = () => {
    setEditEpp(null);
    setFormEpp({ idPersonal: personalId, estado: 'A', talla: '', observacion: '' });
    setShowEpp(true);
  };

  const openEditEpp = (item: PersonalEpp) => {
    setEditEpp(item);
    setFormEpp(item);
    setShowEpp(true);
  };

  const saveEpp = async () => {
    setSaving(true);
    setError('');
    try {
      if (editEpp) await personalEppService.update(editEpp.idPersonalEpp, formEpp);
      else await personalEppService.create(formEpp);
      setShowEpp(false);
      setSuccess('EPP guardado correctamente.');
      void load();
    } catch (err) {
      const api = err as ApiError;
      setError(api.message || 'Error al guardar EPP');
    } finally {
      setSaving(false);
    }
  };

  const removeEpp = async () => {
    if (!deleteEpp) return;
    try {
      await personalEppService.remove(deleteEpp.idPersonalEpp);
      setDeleteEpp(null);
      setSuccess('EPP eliminado correctamente.');
      void load();
    } catch (err) {
      const api = err as ApiError;
      setError(api.message || 'Error al eliminar EPP');
      setDeleteEpp(null);
    }
  };

  const openKardex = (epp: PersonalEpp) => {
    setFormKardex({ idPersonalEpp: epp.idPersonalEpp, estado: 'A' });
    setShowKardex(true);
  };

  const saveKardex = async () => {
    setSaving(true);
    setError('');
    try {
      await personalEppKardexService.create({
        ...formKardex,
        fechaEntrega: toApiDate(String(formKardex.fechaEntrega ?? '')),
        fechaRevision: toApiDate(String(formKardex.fechaRevision ?? '')),
        fechaReposicion: toApiDate(String(formKardex.fechaReposicion ?? '')),
      });
      setShowKardex(false);
      setSuccess('Kardex registrado correctamente.');
      void load();
    } catch (err) {
      const api = err as ApiError;
      setError(api.message || 'Error al guardar Kardex');
    } finally {
      setSaving(false);
    }
  };

  const removeKardex = async () => {
    if (!deleteKardex) return;
    try {
      await personalEppKardexService.remove(deleteKardex.idPersonalEppKardex);
      setDeleteKardex(null);
      setSuccess('Kardex eliminado correctamente.');
      void load();
    } catch (err) {
      const api = err as ApiError;
      setError(api.message || 'Error al eliminar Kardex');
      setDeleteKardex(null);
    }
  };

  return (
    <div className="ficha">
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      <div className="ficha__toolbar">
        <button type="button" className="btn btn--primary" onClick={openCreateEpp}>
          Agregar EPP
        </button>
      </div>

      {loading && <div className="ficha__empty">Cargando...</div>}
      {!loading && eppDePersonal.length === 0 && <div className="ficha__empty">No tiene EPP asignados.</div>}
      {!loading && eppDePersonal.length > 0 && (
        <>
          <DataTable
            columns={columnsEpp as unknown as Column<Record<string, unknown>>[]}
            data={eppDePersonal as unknown as Record<string, unknown>[]}
            viewLabel="Kardex"
            onView={(i) => openKardex(i as unknown as PersonalEpp)}
            onEdit={(i) => openEditEpp(i as unknown as PersonalEpp)}
            onDelete={(i) => setDeleteEpp(i as unknown as PersonalEpp)}
          />

          <h3 className="ficha-page__title" style={{ fontSize: 16, margin: '24px 0 12px' }}>
            Historial Kardex
          </h3>
          {kardexDePersonal.length === 0 ? (
            <div className="ficha__empty">No hay movimientos de Kardex registrados.</div>
          ) : (
            <DataTable
              columns={columnsKardex as unknown as Column<Record<string, unknown>>[]}
              data={kardexDePersonal as unknown as Record<string, unknown>[]}
              onDelete={(i) => setDeleteKardex(i as unknown as PersonalEppKardex)}
            />
          )}
        </>
      )}

      <Modal isOpen={showEpp} title={editEpp ? 'Editar EPP' : 'Nuevo EPP'} onClose={() => setShowEpp(false)}>
        <div className="ficha__grid">
          <FormField label="ID Requerimiento General" name="idRequerimientoGeneral">
            <input
              type="number"
              value={formEpp.idRequerimientoGeneral ?? ''}
              onChange={(e) => setFormEpp((p) => ({ ...p, idRequerimientoGeneral: num(e.target.value) }))}
            />
          </FormField>
          <FormField label="Talla" name="talla">
            <input value={formEpp.talla ?? ''} onChange={(e) => setFormEpp((p) => ({ ...p, talla: e.target.value }))} />
          </FormField>
          <FormField label="Observación" name="observacion">
            <input value={formEpp.observacion ?? ''} onChange={(e) => setFormEpp((p) => ({ ...p, observacion: e.target.value }))} />
          </FormField>
          <FormField label="Estado" name="epp-estado">
            <select value={formEpp.estado ?? 'A'} onChange={(e) => setFormEpp((p) => ({ ...p, estado: e.target.value }))}>
              <option value="A">A - Activo</option>
              <option value="I">I - Inactivo</option>
            </select>
          </FormField>
        </div>
        <div className="catalog-form__actions">
          <button type="button" className="btn btn--secondary" onClick={() => setShowEpp(false)}>
            Cancelar
          </button>
          <button type="button" className="btn btn--primary" onClick={saveEpp} disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={showKardex}
        title={`Kardex - ${getEppNombre(formKardex.idPersonalEpp)}`}
        onClose={() => setShowKardex(false)}
        size="lg"
      >
        <div className="ficha__grid">
          <FormField label="Fecha Entrega" name="fechaEntrega">
            <input
              type="date"
              value={toDateInput(formKardex.fechaEntrega)}
              onChange={(e) => setFormKardex((p) => ({ ...p, fechaEntrega: e.target.value }))}
            />
          </FormField>
          <FormField label="Condición Entrega" name="idEppCondicionEntrega">
            <input
              type="number"
              value={formKardex.idEppCondicionEntrega ?? ''}
              onChange={(e) => setFormKardex((p) => ({ ...p, idEppCondicionEntrega: num(e.target.value) }))}
            />
          </FormField>
          <FormField label="Fecha Revisión" name="fechaRevision">
            <input
              type="date"
              value={toDateInput(formKardex.fechaRevision)}
              onChange={(e) => setFormKardex((p) => ({ ...p, fechaRevision: e.target.value }))}
            />
          </FormField>
          <FormField label="Condición Revisión" name="idEppCondicionRevision">
            <input
              type="number"
              value={formKardex.idEppCondicionRevision ?? ''}
              onChange={(e) => setFormKardex((p) => ({ ...p, idEppCondicionRevision: num(e.target.value) }))}
            />
          </FormField>
          <FormField label="Fecha Reposición" name="fechaReposicion">
            <input
              type="date"
              value={toDateInput(formKardex.fechaReposicion)}
              onChange={(e) => setFormKardex((p) => ({ ...p, fechaReposicion: e.target.value }))}
            />
          </FormField>
          <FormField label="Condición Reposición" name="idEppCondicionReposicion">
            <input
              type="number"
              value={formKardex.idEppCondicionReposicion ?? ''}
              onChange={(e) => setFormKardex((p) => ({ ...p, idEppCondicionReposicion: num(e.target.value) }))}
            />
          </FormField>
          <FormField label="Cantidad" name="cantidad">
            <input
              type="number"
              step="0.01"
              value={formKardex.cantidad ?? ''}
              onChange={(e) => setFormKardex((p) => ({ ...p, cantidad: num(e.target.value) }))}
            />
          </FormField>
          <FormField label="ID Unidad Cantidad" name="idUndidadCantidad">
            <input
              type="number"
              value={formKardex.idUndidadCantidad ?? ''}
              onChange={(e) => setFormKardex((p) => ({ ...p, idUndidadCantidad: num(e.target.value) }))}
            />
          </FormField>
          <FormField label="Estado" name="kardex-estado">
            <select value={formKardex.estado ?? 'A'} onChange={(e) => setFormKardex((p) => ({ ...p, estado: e.target.value }))}>
              <option value="A">A - Activo</option>
              <option value="I">I - Inactivo</option>
            </select>
          </FormField>
        </div>
        <div className="catalog-form__actions">
          <button type="button" className="btn btn--secondary" onClick={() => setShowKardex(false)}>
            Cancelar
          </button>
          <button type="button" className="btn btn--primary" onClick={saveKardex} disabled={saving}>
            {saving ? 'Guardando...' : 'Registrar Kardex'}
          </button>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteEpp}
        title="Eliminar EPP"
        message="¿Está seguro de eliminar este EPP? Se perderá su historial Kardex asociado."
        confirmLabel="Eliminar"
        onConfirm={removeEpp}
        onCancel={() => setDeleteEpp(null)}
      />
      <ConfirmDialog
        isOpen={!!deleteKardex}
        title="Eliminar Kardex"
        message="¿Está seguro de eliminar este movimiento de Kardex?"
        confirmLabel="Eliminar"
        onConfirm={removeKardex}
        onCancel={() => setDeleteKardex(null)}
      />
    </div>
  );
}
