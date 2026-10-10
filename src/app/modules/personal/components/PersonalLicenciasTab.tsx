import { useEffect, useState } from 'react';
import { Alert } from '../../../shared/components/alert';
import { DataTable, type Column } from '../../../shared/components/data-table';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog';
import { Modal } from '../../../shared/components/modal';
import { FormField } from '../../../shared/components/form-field';
import { personalLicenciaService } from '../../../core/services/personal-licencia.service';
import type { PersonalLicenciaConducir } from '../../../models/personal-licencia.model';
import type { ApiError } from '../../../core/interceptors/error.interceptor';

interface Props {
  licenciaAsignadaId?: number | null;
  onAsignar: (idLicPersonal: number | null) => Promise<void>;
}

export function PersonalLicenciasTab({ licenciaAsignadaId, onAsignar }: Props) {
  const [items, setItems] = useState<PersonalLicenciaConducir[]>([]);
  const [seleccion, setSeleccion] = useState<string>(licenciaAsignadaId != null ? String(licenciaAsignadaId) : '');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<PersonalLicenciaConducir | null>(null);
  const [deleteItem, setDeleteItem] = useState<PersonalLicenciaConducir | null>(null);
  const [form, setForm] = useState<Partial<PersonalLicenciaConducir>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setItems(await personalLicenciaService.getAll());
    } catch (err) {
      const api = err as ApiError;
      setError(api.message || 'Error al cargar licencias');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      try {
        const data = await personalLicenciaService.getAll();
        if (!cancelled) {
          setError('');
          setItems(data);
        }
      } catch (err) {
        if (!cancelled) setError((err as ApiError).message || 'Error al cargar licencias');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void fetch();
    return () => { cancelled = true; };
  }, []);

  const columns: Column<PersonalLicenciaConducir>[] = [
    { key: 'idLicPersonal', header: 'ID' },
    { key: 'nombreLicPersonal', header: 'Licencia' },
    { key: 'observaciones', header: 'Observaciones' },
  ];

  const asignada = items.find((i) => i.idLicPersonal === licenciaAsignadaId);

  const handleAsignar = async () => {
    setSaving(true);
    setError('');
    try {
      await onAsignar(seleccion === '' ? null : Number(seleccion));
      setSuccess('Licencia actualizada correctamente.');
    } catch (err) {
      const api = err as ApiError;
      setError(api.message || 'Error al asignar licencia');
    } finally {
      setSaving(false);
    }
  };

  const openCreate = () => {
    setEditItem(null);
    setForm({ nombreLicPersonal: '', observaciones: '' });
    setShowForm(true);
  };

  const openEdit = (item: PersonalLicenciaConducir) => {
    setEditItem(item);
    setForm(item);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError('');
    try {
      if (editItem) {
        await personalLicenciaService.update(editItem.idLicPersonal, form);
      } else {
        await personalLicenciaService.create(form);
      }
      setShowForm(false);
      setSuccess(editItem ? 'Licencia actualizada correctamente.' : 'Licencia creada correctamente.');
      void load();
    } catch (err) {
      const api = err as ApiError;
      setError(api.message || 'Error al guardar licencia');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    try {
      await personalLicenciaService.remove(deleteItem.idLicPersonal);
      setDeleteItem(null);
      setSuccess('Licencia eliminada correctamente.');
      void load();
    } catch (err) {
      const api = err as ApiError;
      setError(api.message || 'Error al eliminar licencia');
      setDeleteItem(null);
    }
  };

  return (
    <div className="ficha">
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      <div className="ficha__grid">
        <FormField label="Licencia de conducir asignada" name="licencia-asignada">
          <select value={seleccion} onChange={(e) => setSeleccion(e.target.value)}>
            <option value="">-- Sin licencia --</option>
            {items.map((i) => (
              <option key={i.idLicPersonal} value={i.idLicPersonal}>
                {i.nombreLicPersonal || `#${i.idLicPersonal}`}
              </option>
            ))}
          </select>
        </FormField>
      </div>
      <div className="ficha__toolbar">
        <button type="button" className="btn btn--primary" onClick={handleAsignar} disabled={saving}>
          {saving ? 'Guardando...' : 'Asignar licencia'}
        </button>
        {asignada && (
          <span>
            Licencia actual: <strong>{asignada.nombreLicPersonal || `#${asignada.idLicPersonal}`}</strong>
          </span>
        )}
      </div>

      <div className="ficha__toolbar">
        <button type="button" className="btn btn--secondary" onClick={openCreate}>
          Nueva licencia (catálogo)
        </button>
      </div>

      {loading && <div className="ficha__empty">Cargando...</div>}
      {!loading && items.length === 0 && <div className="ficha__empty">No hay licencias registradas.</div>}
      {!loading && items.length > 0 && (
        <DataTable
          columns={columns as unknown as Column<Record<string, unknown>>[]}
          data={items as unknown as Record<string, unknown>[]}
          onEdit={(i) => openEdit(i as unknown as PersonalLicenciaConducir)}
          onDelete={(i) => setDeleteItem(i as unknown as PersonalLicenciaConducir)}
        />
      )}

      <Modal isOpen={showForm} title={editItem ? 'Editar Licencia' : 'Nueva Licencia'} onClose={() => setShowForm(false)}>
        <FormField label="Nombre" name="nombreLicPersonal" required>
          <input
            value={form.nombreLicPersonal ?? ''}
            onChange={(e) => setForm((p) => ({ ...p, nombreLicPersonal: e.target.value }))}
          />
        </FormField>
        <FormField label="Observaciones" name="observaciones">
          <input
            value={form.observaciones ?? ''}
            onChange={(e) => setForm((p) => ({ ...p, observaciones: e.target.value }))}
          />
        </FormField>
        <div className="catalog-form__actions">
          <button type="button" className="btn btn--secondary" onClick={() => setShowForm(false)}>
            Cancelar
          </button>
          <button type="button" className="btn btn--primary" onClick={handleSubmit} disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteItem}
        title="Eliminar licencia"
        message="¿Está seguro de eliminar esta licencia del catálogo?"
        confirmLabel="Eliminar"
        onConfirm={handleDelete}
        onCancel={() => setDeleteItem(null)}
      />
    </div>
  );
}
