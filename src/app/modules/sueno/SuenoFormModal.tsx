import { useState } from 'react';
import { Alert } from '../../shared/components/alert';
import { FormField } from '../../shared/components/form-field';
import { Modal } from '../../shared/components/modal';
import type { Personal } from '../../models/personal.model';
import type { PersonalSueno } from '../../models/personal-sueno.model';
import '../catalogs/catalog-form.css';

interface SuenoFormModalProps {
  isOpen: boolean;
  title: string;
  personalList: Personal[];
  initialValues?: PersonalSueno | null;
  onSubmit: (values: SuenoFormValues) => Promise<void>;
  onCancel: () => void;
}

export interface SuenoFormValues {
  idPersonal?: number | null;
  fecha?: string | null;
  sueno?: string | null;
  observaciones?: string | null;
}

function formatFecha(value?: string | null): string {
  if (!value) return '';
  return value.slice(0, 10);
}

export function SuenoFormModal({
  isOpen,
  title,
  personalList,
  initialValues,
  onSubmit,
  onCancel,
}: SuenoFormModalProps) {
  const [idPersonal, setIdPersonal] = useState<string>(
    initialValues?.idPersonal != null ? String(initialValues.idPersonal) : '',
  );
  const [fecha, setFecha] = useState<string>(formatFecha(initialValues?.fecha));
  const [sueno, setSueno] = useState<string>(initialValues?.sueno ?? '');
  const [observaciones, setObservaciones] = useState<string>(initialValues?.observaciones ?? '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!idPersonal) {
      setError('Seleccione el personal.');
      return;
    }
    if (!fecha) {
      setError('Ingrese la fecha del descanso.');
      return;
    }
    if (!sueno) {
      setError('Ingrese las horas de descanso (formato HH:MM).');
      return;
    }

    setSaving(true);
    try {
      await onSubmit({
        idPersonal: Number(idPersonal),
        fecha,
        sueno: sueno.slice(0, 5),
        observaciones: observaciones || null,
      });
    } catch (err) {
      const message = (err as { message?: string })?.message || 'Error al guardar el registro.';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} title={title} onClose={onCancel}>
      <form className="catalog-form" onSubmit={handleSubmit} noValidate>
        <FormField label="Conductor" name="idPersonal" required>
          <select
            id="idPersonal"
            value={idPersonal}
            onChange={(e) => setIdPersonal(e.target.value)}
            autoFocus
          >
            <option value="">Seleccione un conductor...</option>
            {personalList.map((p) => (
              <option key={p.idPersonal} value={p.idPersonal}>
                {[p.apPersonal, p.amPersonal, p.nomPersonal].filter(Boolean).join(' ').trim() ||
                  `Personal ${p.idPersonal}`}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Fecha" name="fecha" required>
          <input
            id="fecha"
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
        </FormField>

        <FormField label="Horas de descanso" name="sueno" required>
          <input
            id="sueno"
            type="time"
            value={sueno}
            onChange={(e) => setSueno(e.target.value)}
            placeholder="08:30"
          />
        </FormField>

        <FormField label="Observaciones" name="observaciones">
          <input
            id="observaciones"
            type="text"
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            placeholder="Opcional"
          />
        </FormField>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        <div className="catalog-form__actions">
          <button type="button" className="btn btn--secondary" onClick={onCancel}>
            Cancelar
          </button>
          <button type="submit" className="btn btn--primary" disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}