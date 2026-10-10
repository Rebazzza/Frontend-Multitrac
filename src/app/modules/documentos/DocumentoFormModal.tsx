import { useMemo, useState, type FormEvent } from 'react';
import { Alert } from '../../shared/components/alert';
import { FormField } from '../../shared/components/form-field';
import { Modal } from '../../shared/components/modal';
import type { DocumentoListadoDto, TipoSujeto } from '../../models/documento.model';
import { SUJETO_LABELS } from '../../models/documento.model';
import { metadataTipoDocumento, sujetosPorTipo, tiposPorSujeto } from './documentos-catalogos';
import '../catalogs/catalog-form.css';

export interface DocumentoFormValues {
  tipoSujeto: TipoSujeto;
  idSujeto?: number | null;
  idTipoDocumento?: number | null;
  nroDocumento?: string | null;
  fechaExpedicion?: string | null;
  fechaCaducidad?: string | null;
  kilometraje?: number | null;
  observacion?: string | null;
  examenMedicoFactura?: string | null;
  examenMedicoFechaFactura?: string | null;
  examenMedicoMonto?: number | null;
  examenMedicoMoneda?: string | null;
}

interface DocumentoFormModalProps {
  isOpen: boolean;
  title: string;
  sujeto: TipoSujeto;
  initialValues?: DocumentoListadoDto | null;
  onSubmit: (values: DocumentoFormValues) => Promise<void>;
  onCancel: () => void;
}

const SUJETO_TITULO: Record<TipoSujeto, string> = {
  EQUIPO: 'Equipo',
  PERSONAL: 'Personal',
  CONTRATISTA: 'Contratista',
};

const MONEDAS = [
  { value: 'PEN', label: 'S/ (PEN)' },
  { value: 'USD', label: 'US$ (USD)' },
];

function toDateInput(value?: string | null): string {
  if (!value) return '';
  return value.slice(0, 10);
}

function fechaApi(value: string): string | null {
  if (!value) return null;
  return `${value}T00:00:00`;
}

export function DocumentoFormModal({
  isOpen,
  title,
  sujeto,
  initialValues,
  onSubmit,
  onCancel,
}: DocumentoFormModalProps) {
  const [sujetoActual, setSujetoActual] = useState<TipoSujeto>(sujeto);
  const [idSujeto, setIdSujeto] = useState<string>(
    initialValues?.idSujeto != null ? String(initialValues.idSujeto) : '',
  );
  const [idTipoDocumento, setIdTipoDocumento] = useState<string>(
    initialValues?.idTipoDocumento != null ? String(initialValues.idTipoDocumento) : '',
  );
  const [nroDocumento, setNroDocumento] = useState(initialValues?.nroDocumento ?? '');
  const [fechaExpedicion, setFechaExpedicion] = useState(toDateInput(initialValues?.fechaExpedicion));
  const [fechaCaducidad, setFechaCaducidad] = useState(toDateInput(initialValues?.fechaCaducidad));
  const [kilometraje, setKilometraje] = useState(
    initialValues?.kilometraje != null ? String(initialValues.kilometraje) : '',
  );
  const [observacion, setObservacion] = useState('');
  const [factura, setFactura] = useState('');
  const [fechaFactura, setFechaFactura] = useState('');
  const [monto, setMonto] = useState('');
  const [moneda, setMoneda] = useState('PEN');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const tipos = useMemo(() => tiposPorSujeto(sujetoActual), [sujetoActual]);
  const opcionesSujeto = useMemo(() => sujetosPorTipo(sujetoActual), [sujetoActual]);
  const metadata = useMemo(
    () => metadataTipoDocumento(idTipoDocumento ? Number(idTipoDocumento) : null),
    [idTipoDocumento],
  );

  const handleSujetoChange = (nuevo: TipoSujeto) => {
    setSujetoActual(nuevo);
    setIdSujeto('');
    setIdTipoDocumento('');
    setFechaCaducidad('');
    setKilometraje('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!idSujeto) {
      setError('Seleccione el sujeto del documento.');
      return;
    }
    if (!idTipoDocumento) {
      setError('Seleccione el tipo de documento.');
      return;
    }
    if (metadata?.requiereFechaCaducidad && !fechaCaducidad) {
      setError('La fecha de caducidad es obligatoria para este tipo de documento.');
      return;
    }
    if (metadata?.requiereKilometraje && !kilometraje) {
      setError('El kilometraje es obligatorio para este tipo de documento.');
      return;
    }
    if (metadata?.requiereFacturacion && (!factura.trim() || !monto)) {
      setError('Complete la facturación del examen médico (nro. de factura y monto).');
      return;
    }

    setSaving(true);
    try {
      await onSubmit({
        tipoSujeto: sujetoActual,
        idSujeto: Number(idSujeto),
        idTipoDocumento: Number(idTipoDocumento),
        nroDocumento: nroDocumento.trim() || null,
        fechaExpedicion: fechaApi(fechaExpedicion),
        fechaCaducidad: metadata?.requiereFechaCaducidad ? fechaApi(fechaCaducidad) : null,
        kilometraje: metadata?.requiereKilometraje && kilometraje ? Number(kilometraje) : null,
        observacion: observacion.trim() || null,
        examenMedicoFactura: metadata?.requiereExamenMedico ? factura.trim() || null : null,
        examenMedicoFechaFactura: metadata?.requiereExamenMedico ? fechaApi(fechaFactura) : null,
        examenMedicoMonto: metadata?.requiereExamenMedico && monto ? Number(monto) : null,
        examenMedicoMoneda: metadata?.requiereExamenMedico ? moneda : null,
      });
    } catch (err) {
      setError((err as { message?: string })?.message || 'Error al guardar el documento.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} title={title} onClose={onCancel} size="lg">
      <form className="catalog-form" onSubmit={handleSubmit} noValidate>
        <FormField label="Tipo de sujeto" name="tipoSujeto" required>
          <select
            id="tipoSujeto"
            value={sujetoActual}
            onChange={(e) => handleSujetoChange(e.target.value as TipoSujeto)}
            autoFocus
          >
            {(Object.keys(SUJETO_LABELS) as TipoSujeto[]).map((t) => (
              <option key={t} value={t}>
                {SUJETO_LABELS[t]}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label={SUJETO_TITULO[sujetoActual]} name="idSujeto" required>
          <select id="idSujeto" value={idSujeto} onChange={(e) => setIdSujeto(e.target.value)}>
            <option value="">Seleccione {SUJETO_TITULO[sujetoActual].toLowerCase()}...</option>
            {opcionesSujeto.map((s) => (
              <option key={s.idSujeto} value={s.idSujeto}>
                {s.codigo}
                {s.descripcion ? ` · ${s.descripcion}` : ''}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Tipo de documento" name="idTipoDocumento" required>
          <select
            id="idTipoDocumento"
            value={idTipoDocumento}
            onChange={(e) => setIdTipoDocumento(e.target.value)}
          >
            <option value="">Seleccione un tipo...</option>
            {tipos.map((t) => (
              <option key={t.idTipoDocumento} value={t.idTipoDocumento}>
                {t.nombreTipoDocumento}
              </option>
            ))}
          </select>
        </FormField>

        {!metadata && idTipoDocumento === '' && (
          <span className="catalog-form__hint">
            Seleccione un tipo de documento para mostrar los campos requeridos (caducidad,
            kilometraje o facturación del examen médico).
          </span>
        )}

        <FormField label="Nro. documento" name="nroDocumento">
          <input
            id="nroDocumento"
            type="text"
            value={nroDocumento}
            onChange={(e) => setNroDocumento(e.target.value)}
            placeholder="Ej.: A-112233"
          />
        </FormField>

        <FormField label="Fecha expedición" name="fechaExpedicion">
          <input
            id="fechaExpedicion"
            type="date"
            value={fechaExpedicion}
            onChange={(e) => setFechaExpedicion(e.target.value)}
          />
        </FormField>

        {metadata?.requiereFechaCaducidad && (
          <FormField label="Fecha caducidad" name="fechaCaducidad" required>
            <input
              id="fechaCaducidad"
              type="date"
              value={fechaCaducidad}
              onChange={(e) => setFechaCaducidad(e.target.value)}
            />
          </FormField>
        )}

        {metadata?.requiereKilometraje && (
          <FormField label="Kilometraje" name="kilometraje" required>
            <input
              id="kilometraje"
              type="number"
              min="0"
              step="1"
              value={kilometraje}
              onChange={(e) => setKilometraje(e.target.value)}
              placeholder="Ej.: 185000"
            />
          </FormField>
        )}

        {metadata?.requiereExamenMedico && (
          <fieldset className="documentos-form__section">
            <legend className="documentos-form__legend">Facturación examen médico</legend>

            <FormField label="Nro. factura" name="examenMedicoFactura">
              <input
                id="examenMedicoFactura"
                type="text"
                value={factura}
                onChange={(e) => setFactura(e.target.value)}
                placeholder="Ej.: F001-000123"
              />
            </FormField>

            <FormField label="Fecha factura" name="examenMedicoFechaFactura">
              <input
                id="examenMedicoFechaFactura"
                type="date"
                value={fechaFactura}
                onChange={(e) => setFechaFactura(e.target.value)}
              />
            </FormField>

            <FormField label="Monto" name="examenMedicoMonto">
              <input
                id="examenMedicoMonto"
                type="number"
                min="0"
                step="0.01"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                placeholder="0.00"
              />
            </FormField>

            <FormField label="Moneda" name="examenMedicoMoneda">
              <select id="examenMedicoMoneda" value={moneda} onChange={(e) => setMoneda(e.target.value)}>
                {MONEDAS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </FormField>
          </fieldset>
        )}

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
