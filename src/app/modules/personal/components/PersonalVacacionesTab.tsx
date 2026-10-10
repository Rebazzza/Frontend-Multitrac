import { useEffect, useMemo, useState } from 'react';
import { Alert } from '../../../shared/components/alert';
import { DataTable, type Column } from '../../../shared/components/data-table';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog';
import { Modal } from '../../../shared/components/modal';
import { FormField } from '../../../shared/components/form-field';
import { personalVacacionesService } from '../../../core/services/personal-vacaciones.service';
import type { PersonalVacaciones } from '../../../models/personal-vacaciones.model';
import type { ApiError } from '../../../core/interceptors/error.interceptor';
import { formatFecha, toApiDate, toDateInput } from '../../../core/utils/format';

interface Props {
  personalId: number;
}

const num = (v: string): number | null => (v === '' ? null : Number(v));

export function PersonalVacacionesTab({ personalId }: Props) {
  const [items, setItems] = useState<PersonalVacaciones[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<PersonalVacaciones | null>(null);
  const [deleteItem, setDeleteItem] = useState<PersonalVacaciones | null>(null);
  const [form, setForm] = useState<Partial<PersonalVacaciones>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setItems(await personalVacacionesService.getAll());
    } catch (err) {
      const api = err as ApiError;
      setError(api.message || 'Error al cargar vacaciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      try {
        const data = await personalVacacionesService.getAll();
        if (!cancelled) {
          setError('');
          setItems(data);
        }
      } catch (err) {
        if (!cancelled) setError((err as ApiError).message || 'Error al cargar vacaciones');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void fetch();
    return () => { cancelled = true; };
  }, []);

  const vacacionesDePersonal = useMemo(
    () => items.filter((v) => String(v.idPersonal) === String(personalId)),
    [items, personalId],
  );

  // El backend no genera la clave primaria (ValueGeneratedNever), por eso el
  // siguiente id se calcula en el cliente a partir del maximo existente.
  const nextId = useMemo(
    () => items.reduce((max, v) => (v.idPersonalVacaciones > max ? v.idPersonalVacaciones : max), 0) + 1,
    [items],
  );

  const columns: Column<PersonalVacaciones>[] = [
    { key: 'idPersonalVacaciones', header: 'ID' },
    { key: 'periodoIni', header: 'Periodo Ini.' },
    { key: 'periodoFin', header: 'Periodo Fin.' },
    { key: 'fechaIng', header: 'Fecha Ingreso', render: (i) => <span>{formatFecha(i.fechaIng)}</span> },
    { key: 'diasPendientes', header: 'Días Pendientes' },
    { key: 'observaciones', header: 'Observaciones' },
    { key: 'estado', header: 'Estado' },
  ];

  const openCreate = () => {
    setEditItem(null);
    setForm({ idPersonal: personalId, idPersonalVacaciones: nextId, estado: 'A' });
    setShowForm(true);
  };

  const openEdit = (item: PersonalVacaciones) => {
    setEditItem(item);
    setForm(item);
    setShowForm(true);
  };

  const save = async () => {
    setSaving(true);
    setError('');
    try {
      const dto: Partial<PersonalVacaciones> = {
        ...form,
        fechaIng: toApiDate(String(form.fechaIng ?? '')),
      };
      if (editItem) await personalVacacionesService.update(editItem.idPersonalVacaciones, dto);
      else await personalVacacionesService.create(dto);
      setShowForm(false);
      setSuccess(editItem ? 'Vacaciones actualizadas correctamente.' : 'Vacaciones registradas correctamente.');
      void load();
    } catch (err) {
      const api = err as ApiError;
      setError(api.message || 'Error al guardar vacaciones');
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!deleteItem) return;
    try {
      await personalVacacionesService.remove(deleteItem.idPersonalVacaciones);
      setDeleteItem(null);
      setSuccess('Vacaciones eliminadas correctamente.');
      void load();
    } catch (err) {
      const api = err as ApiError;
      setError(api.message || 'Error al eliminar vacaciones');
      setDeleteItem(null);
    }
  };

  return (
    <div className="ficha">
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      <div className="ficha__toolbar">
        <button type="button" className="btn btn--primary" onClick={openCreate}>
          Registrar Vacaciones
        </button>
      </div>

      {loading && <div className="ficha__empty">Cargando...</div>}
      {!loading && vacacionesDePersonal.length === 0 && <div className="ficha__empty">No tiene vacaciones registradas.</div>}
      {!loading && vacacionesDePersonal.length > 0 && (
        <DataTable
          columns={columns as unknown as Column<Record<string, unknown>>[]}
          data={vacacionesDePersonal as unknown as Record<string, unknown>[]}
          onEdit={(i) => openEdit(i as unknown as PersonalVacaciones)}
          onDelete={(i) => setDeleteItem(i as unknown as PersonalVacaciones)}
        />
      )}

      <Modal
        isOpen={showForm}
        title={editItem ? 'Editar Vacaciones' : 'Registrar Vacaciones'}
        onClose={() => setShowForm(false)}
      >
        <div className="ficha__grid">
          <FormField label="ID" name="idPersonalVacaciones">
            <input type="number" value={form.idPersonalVacaciones ?? ''} readOnly />
          </FormField>
          <FormField label="Periodo Inicial" name="periodoIni">
            <input type="number" value={form.periodoIni ?? ''} onChange={(e) => setForm((p) => ({ ...p, periodoIni: num(e.target.value) }))} />
          </FormField>
          <FormField label="Periodo Final" name="periodoFin">
            <input type="number" value={form.periodoFin ?? ''} onChange={(e) => setForm((p) => ({ ...p, periodoFin: num(e.target.value) }))} />
          </FormField>
          <FormField label="Fecha Ingreso" name="fechaIng">
            <input type="date" value={toDateInput(form.fechaIng)} onChange={(e) => setForm((p) => ({ ...p, fechaIng: e.target.value }))} />
          </FormField>
          <FormField label="Días Pendientes" name="diasPendientes">
            <input type="number" value={form.diasPendientes ?? ''} onChange={(e) => setForm((p) => ({ ...p, diasPendientes: num(e.target.value) }))} />
          </FormField>
          <FormField label="Observaciones" name="observaciones">
            <input value={form.observaciones ?? ''} onChange={(e) => setForm((p) => ({ ...p, observaciones: e.target.value }))} />
          </FormField>
          <FormField label="Estado" name="vacaciones-estado">
            <select value={form.estado ?? 'A'} onChange={(e) => setForm((p) => ({ ...p, estado: e.target.value }))}>
              <option value="A">A - Activo</option>
              <option value="I">I - Inactivo</option>
            </select>
          </FormField>
        </div>
        <div className="catalog-form__actions">
          <button type="button" className="btn btn--secondary" onClick={() => setShowForm(false)}>
            Cancelar
          </button>
          <button type="button" className="btn btn--primary" onClick={save} disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteItem}
        title="Eliminar vacaciones"
        message="¿Está seguro de eliminar este registro de vacaciones?"
        confirmLabel="Eliminar"
        onConfirm={remove}
        onCancel={() => setDeleteItem(null)}
      />
    </div>
  );
}
