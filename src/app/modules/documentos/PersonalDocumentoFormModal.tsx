import { useState } from 'react';
import { Alert } from '../../shared/components/alert';
import { FormField } from '../../shared/components/form-field';
import { Modal } from '../../shared/components/modal';
import type { CatalogoPersonalDocumento, CatalogoPersonalPersonal, PersonalDocumentoListadoDto } from '../../models/personal-documento.model';
import '../catalogs/catalog-form.css';

interface PersonalDocumentoFormModalProps {
  isOpen: boolean;
  title: string;
  personales: CatalogoPersonalPersonal[];
  documentos: CatalogoPersonalDocumento[];
  initialValues?: PersonalDocumentoListadoDto | null;
  onSubmit: (values: PersonalDocumentoFormValues) => Promise<void>;
  onCancel: () => void;
}

export interface PersonalDocumentoFormValues {
  idPersonal?: number | null;
  idDocumento?: number | null;
  nroDocumento?: string | null;
  fechaExped?: string | null;
  fechaVencimiento?: string | null;
  estado?: string | null;
  observacion?: string | null;
}

function toDateInput(value?: string | null): string {
  if (!value) return '';
  return value.slice(0, 10);
}

function toApiDate(value: string): string | null {
  if (!value) return null;
  return `${value}T00:00:00`;
}

export function PersonalDocumentoFormModal({
  isOpen,
  title,
  personales,
  documentos,
  initialValues,
  onSubmit,
  onCancel,
}: PersonalDocumentoFormModalProps) {
  const [idPersonal, setIdPersonal] = useState<string>(
    initialValues?.idPersonal != null ? String(initialValues.idPersonal) : '',
  );
  const [idDocumento, setIdDocumento] = useState<string>(
    initialValues?.idDocumento != null ? String(initialValues.idDocumento) : '',
  );
  const [nroDocumento, setNroDocumento] = useState<string>(initialValues?.nroDocumento ?? '');
  const [fechaExped, setFechaExped] = useState<string>(toDateInput(initialValues?.fechaExpedida));
  const [fechaVencimiento, setFechaVencimiento] = useState<string>(toDateInput(initialValues?.fechaCaducidad));
  const [estado, setEstado] = useState<string>(initialValues?.estado ?? 'A');
  const [observacion, setObservacion] = useState<string>('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!idPersonal) {
      setError('Seleccione el personal.');
      return;
    }
    if (!idDocumento) {
      setError('Seleccione el documento.');
      return;
    }

    setSaving(true);
    try {
      await onSubmit({
        idPersonal: Number(idPersonal),
        idDocumento: Number(idDocumento),
        nroDocumento: nroDocumento.trim() || null,
        fechaExped: toApiDate(fechaExped),
        fechaVencimiento: toApiDate(fechaVencimiento),
        estado: estado || 'A',
        observacion: observacion.trim() || null,
      });
    } catch (err) {
      const message = (err as { message?: string })?.message || 'Error al guardar el documento.';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} title={title} onClose={onCancel}>
      <form className="catalog-form" onSubmit={handleSubmit} noValidate>
        <FormField label="Personal" name="idPersonal" required>
          <select
            id="idPersonal"
            value={idPersonal}
            onChange={(e) => setIdPersonal(e.target.value)}
            autoFocus
          >
            <option value="">Seleccione un personal...</option>
            {personales
              .filter((p) => p.idPersonal > 0)
              .map((p) => (
                <option key={p.idPersonal} value={p.idPersonal}>
                  {p.personal?.trim() || `Personal ${p.idPersonal}`}
                </option>
              ))}
          </select>
        </FormField>

        <FormField label="Documento" name="idDocumento" required>
          <select
            id="idDocumento"
            value={idDocumento}
            onChange={(e) => setIdDocumento(e.target.value)}
          >
            <option value="">Seleccione un documento...</option>
            {documentos.map((doc) => (
              <option key={doc.idDocumento} value={doc.idDocumento}>
                {doc.nombreDocumento?.trim() || `Documento ${doc.idDocumento}`}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Nro. Documento" name="nroDocumento">
          <input
            id="nroDocumento"
            type="text"
            value={nroDocumento}
            onChange={(e) => setNroDocumento(e.target.value)}
            placeholder="Ej.: L47012216"
          />
        </FormField>

        <FormField label="Fecha expedida" name="fechaExped">
          <input
            id="fechaExped"
            type="date"
            value={fechaExped}
            onChange={(e) => setFechaExped(e.target.value)}
          />
        </FormField>

        <FormField label="Fecha vencimiento" name="fechaVencimiento">
          <input
            id="fechaVencimiento"
            type="date"
            value={fechaVencimiento}
            onChange={(e) => setFechaVencimiento(e.target.value)}
          />
        </FormField>

        <FormField label="Estado" name="estado">
          <select id="estado" value={estado} onChange={(e) => setEstado(e.target.value)}>
            <option value="A">Activo</option>
            <option value="I">Inactivo</option>
          </select>
        </FormField>

        <FormField label="Observación" name="observacion">
          <input
            id="observacion"
            type="text"
            value={observacion}
            onChange={(e) => setObservacion(e.target.value)}
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