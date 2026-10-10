import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Modal } from "../../shared/components/modal";
import { FormField } from "../../shared/components/form-field";
import { Alert } from "../../shared/components/alert";
import type { Operacion, OperacionCreateDto, OperacionUpdateDto } from "../../models/operacion.model";
import { operacionService } from "../../core/services/operacion.service";

interface ValidationError {
  [field: string]: string[];
}

interface ApiError {
  status?: number;
  message?: string;
  validationErrors?: ValidationError;
}

interface OperacionFormModalProps {
  isOpen: boolean;
  operacion: Operacion | null;
  onClose: () => void;
  onSaved: () => void;
}

export function OperacionFormModal({ isOpen, operacion, onClose, onSaved }: OperacionFormModalProps) {
  const [formData, setFormData] = useState<OperacionCreateDto>({
    descOperacion: "",
    idCliente: 0,
    origen: "",
    destino: "",
    estado: "Planificado",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (operacion) {
      setFormData({
        descOperacion: operacion.descOperacion ?? "",
        idCliente: operacion.idCliente ?? 0,
        origen: operacion.origen ?? "",
        destino: operacion.destino ?? "",
        estado: operacion.estado ?? "Planificado",
      });
    } else {
      setFormData({
        descOperacion: "",
        idCliente: 0,
        origen: "",
        destino: "",
        estado: "Planificado",
      });
    }
    setError(null);
    setFieldErrors({});
  }, [operacion, isOpen]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value === "" ? undefined : name === "idCliente" ? Number(value) : value,
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
      if (operacion) {
        const updateDto: OperacionUpdateDto = { idOperacion: operacion.idOperacion, ...formData } as any;
        await operacionService.update(operacion.idOperacion, updateDto as any);
      } else {
        await operacionService.create(formData as any);
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
      setError(apiError?.message ?? "Error al guardar operacion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} title={operacion ? "Editar Operacion" : "Nueva Operacion"} onClose={onClose} size="lg">
      <form onSubmit={handleSubmit} className="form-grid">
        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
        <FormField name="descOperacion" label="Descripcion" required error={fieldErrors["descOperacion"]}>
          <input name="descOperacion" value={formData.descOperacion ?? ""} onChange={handleChange} required />
        </FormField>
        <div className="form-actions">
          <button type="button" className="btn btn--secondary" onClick={onClose} disabled={loading}>Cancelar</button>
          <button type="submit" className="btn btn--primary" disabled={loading}>{loading ? "Guardando..." : "Guardar"}</button>
        </div>
      </form>
    </Modal>
  );
}

