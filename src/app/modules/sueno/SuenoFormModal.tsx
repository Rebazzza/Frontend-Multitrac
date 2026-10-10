import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Modal } from "../../shared/components/modal";
import { FormField } from "../../shared/components/form-field";
import { Alert } from "../../shared/components/alert";
import type { PersonalSueno, PersonalSuenoCreateDto, PersonalSuenoUpdateDto } from "../../models/personal-sueno.model";
import { suenoService } from "../../core/services/sueno.service";
import { useLookupMaps } from "../../core/hooks/use-lookup-maps";

interface ValidationError {
  [field: string]: string[];
}

interface ApiError {
  status?: number;
  message?: string;
  validationErrors?: ValidationError;
}

interface SuenoFormModalProps {
  isOpen: boolean;
  registro: PersonalSueno | null;
  onClose: () => void;
  onSaved: () => void;
}

const FORM_VACIO: PersonalSuenoCreateDto = {
  idPersonal: 0,
  fecha: "",
  sueno: "",
  observaciones: "",
};

export function SuenoFormModal({ isOpen, registro, onClose, onSaved }: SuenoFormModalProps) {
  const [formData, setFormData] = useState<PersonalSuenoCreateDto>(FORM_VACIO);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const lookup = useLookupMaps([
    { key: "personal", resource: "Personal", idField: "idPersonal" },
  ]) as any;
  const personalMap = lookup.personalMap ?? lookup.maps?.personal ?? new Map();

  useEffect(() => {
    if (registro) {
      setFormData({
        idPersonal: registro.idPersonal,
        fecha: registro.fecha ? String(registro.fecha).slice(0, 10) : "",
        sueno: registro.sueno ?? "",
        observaciones: registro.observaciones ?? "",
      });
    } else {
      setFormData(FORM_VACIO);
    }
    setError(null);
    setFieldErrors({});
  }, [registro, isOpen]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? undefined : name === "idPersonal" ? Number(value) : value,
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
      if (registro) {
        const updateDto: PersonalSuenoUpdateDto = {
          idSueno: registro.idSueno,
          ...formData,
        };
        await suenoService.update(registro.idSueno, updateDto);
      } else {
        await suenoService.create(formData);
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
      setError(apiError?.message ?? "Error al guardar registro de sueno");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} title={registro ? "Editar Registro de Sueño" : "Nuevo Registro de Sueño"} onClose={onClose} size="lg">
      <form onSubmit={handleSubmit} className="form-grid">
        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
        <FormField name="idPersonal" label="Trabajador" required error={fieldErrors["idPersonal"]}>
          <select name="idPersonal" value={formData.idPersonal || ""} onChange={handleChange} required>
            <option value="">Seleccione...</option>
            {Array.from(personalMap.values()).map((p: any) => (
              <option key={p.idPersonal} value={p.idPersonal}>{p.nomPersonal} {p.apPersonal}</option>
            ))}
          </select>
        </FormField>
        <FormField name="fecha" label="Fecha" error={fieldErrors["fecha"]}>
          <input type="date" name="fecha" value={formData.fecha ?? ""} onChange={handleChange} />
        </FormField>
        <FormField name="sueno" label="Descanso (HH:MM)" error={fieldErrors["sueno"]}>
          <input
            type="text"
            name="sueno"
            value={formData.sueno ?? ""}
            onChange={handleChange}
            placeholder="08:30"
            maxLength={5}
          />
        </FormField>
        <FormField name="observaciones" label="Observaciones" error={fieldErrors["observaciones"]}>
          <textarea
            name="observaciones"
            value={formData.observaciones ?? ""}
            onChange={handleChange}
            maxLength={500}
            rows={3}
          />
        </FormField>
        <div className="form-actions">
          <button type="button" className="btn btn--secondary" onClick={onClose} disabled={loading}>Cancelar</button>
          <button type="submit" className="btn btn--primary" disabled={loading}>{loading ? "Guardando..." : "Guardar"}</button>
        </div>
      </form>
    </Modal>
  );
}
