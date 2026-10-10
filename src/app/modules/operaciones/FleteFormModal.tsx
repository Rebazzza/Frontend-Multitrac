import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Modal } from "../../shared/components/modal";
import { FormField } from "../../shared/components/form-field";
import { Alert } from "../../shared/components/alert";
import type { OperacionFlete } from "../../models/operacion-flete.model";
import { operacionFleteService } from "../../core/services/operacion-flete.service";

interface ValidationError {
  [field: string]: string[];
}

interface ApiError {
  status?: number;
  message?: string;
  validationErrors?: ValidationError;
}

interface FleteFormModalProps {
  isOpen: boolean;
  flete: OperacionFlete | null;
  onClose: () => void;
  onSaved: () => void;
}

export function FleteFormModal({ isOpen, flete, onClose, onSaved }: FleteFormModalProps) {
  const [formData, setFormData] = useState<Partial<OperacionFlete>>({
    idOperacion: 0,
    numeroGuia: "",
    peso: 0,
    tarifaFlete: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (flete) {
      setFormData({
        idOperacion: flete.idOperacion ?? 0,
        numeroGuia: flete.numeroGuia ?? "",
        peso: flete.peso ?? 0,
        tarifaFlete: flete.tarifaFlete ?? 0,
        grRemitente: flete.grRemitente ?? "",
        grTransportista: flete.grTransportista ?? "",
        guiaRemision: flete.guiaRemision ?? "",
        fecha: flete.fecha ?? "",
        observaciones: flete.observaciones ?? "",
      });
    } else {
      setFormData({
        idOperacion: 0,
        numeroGuia: "",
        peso: 0,
        tarifaFlete: 0,
        grRemitente: "",
        grTransportista: "",
        guiaRemision: "",
        fecha: "",
        observaciones: "",
      });
    }
    setError(null);
    setFieldErrors({});
  }, [flete, isOpen]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value === "" ? undefined : ["idOperacion", "peso", "tarifaFlete"].includes(name) ? Number(value) : value,
    }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({});
    try {
      if (flete?.idOperacionFlete) {
        await operacionFleteService.update(flete.idOperacionFlete, formData);
      } else {
        await operacionFleteService.create(formData);
      }
      onSaved();
    } catch (err) {
      const apiError = err as ApiError;
      if (apiError?.validationErrors) {
        const mapped: Record<string, string> = {};
        Object.entries(apiError.validationErrors).forEach(([key, messages]) => {
          if (messages && messages[0]) mapped[key] = messages[0];
        });
        setFieldErrors(mapped);
      }
      setError(apiError?.message ?? "Error al guardar flete");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} title={flete ? "Editar Flete" : "Nuevo Flete"} onClose={onClose} size="lg">
      <form onSubmit={handleSubmit} className="form-grid">
        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
        <FormField name="idOperacion" label="Operación" required error={fieldErrors["idOperacion"]}>
          <input type="number" name="idOperacion" value={formData.idOperacion ?? ""} onChange={handleChange} required />
        </FormField>
        <FormField name="numeroGuia" label="Numero Guia" error={fieldErrors["numeroGuia"]}>
          <input name="numeroGuia" value={formData.numeroGuia ?? ""} onChange={handleChange} />
        </FormField>
        <FormField name="peso" label="Peso" error={fieldErrors["peso"]}>
          <input type="number" step="0.01" name="peso" value={formData.peso ?? ""} onChange={handleChange} />
        </FormField>
        <FormField name="tarifaFlete" label="Tarifa Flete" error={fieldErrors["tarifaFlete"]}>
          <input type="number" step="0.01" name="tarifaFlete" value={formData.tarifaFlete ?? ""} onChange={handleChange} />
        </FormField>
        <FormField name="fecha" label="Fecha" error={fieldErrors["fecha"]}>
          <input type="date" name="fecha" value={formData.fecha ?? ""} onChange={handleChange} />
        </FormField>
        <FormField name="observaciones" label="Observaciones" error={fieldErrors["observaciones"]}>
          <textarea name="observaciones" value={formData.observaciones ?? ""} onChange={handleChange} />
        </FormField>
        <div className="form-actions">
          <button type="button" className="btn btn--secondary" onClick={onClose} disabled={loading}>Cancelar</button>
          <button type="submit" className="btn btn--primary" disabled={loading}>{loading ? "Guardando..." : "Guardar"}</button>
        </div>
      </form>
    </Modal>
  );
}
