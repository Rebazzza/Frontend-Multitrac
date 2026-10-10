import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { Modal } from '../../shared/components/modal';
import { FormField } from '../../shared/components/form-field';
import { Alert } from '../../shared/components/alert';
import type { OperacionGeneralEquipo } from '../../models/operacion.model';
import { operacionGeneralEquipoService } from '../../core/services/operacion-general-equipo.service';

interface ApiError {
  status?: number;
  message?: string;
}

interface AsignacionFlotaModalProps {
  isOpen: boolean;
  idOperacionGeneral?: number | null;
  onClose: () => void;
  onSaved: () => void;
}

export function AsignacionFlotaModal({ isOpen, idOperacionGeneral, onClose, onSaved }: AsignacionFlotaModalProps) {
  const [formData, setFormData] = useState<Partial<OperacionGeneralEquipo>>({
    idOperacionGeneral: idOperacionGeneral ?? undefined,
    convoy: undefined,
    posicion: undefined,
    codEquipoTracto: '',
    codEquipoCarreta: '',
    carretaTercero: false,
    idPersonal: undefined,
    tipo: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, idOperacionGeneral: idOperacionGeneral ?? undefined }));
    setError(null);
  }, [idOperacionGeneral, isOpen]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value === '' ? undefined : ['convoy', 'posicion', 'idPersonal', 'idOperacionGeneral'].includes(name) ? Number(value) : value,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await operacionGeneralEquipoService.create(formData);
      onSaved();
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError?.message ?? 'Error al asignar convoy/flota');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} title='Asignación de Convoy y Flota' onClose={onClose} size='md'>
      <form onSubmit={handleSubmit} className='form-grid'>
        {error && <Alert type='error' message={error} onClose={() => setError(null)} />}
        <FormField label='Convoy' name='convoy'>
          <input type='number' name='convoy' value={formData.convoy ?? ''} onChange={handleChange} />
        </FormField>
        <FormField label='Posición' name='posicion'>
          <input type='number' name='posicion' value={formData.posicion ?? ''} onChange={handleChange} />
        </FormField>
        <FormField label='Tracto (Código)' name='codEquipoTracto' required>
          <input type='text' name='codEquipoTracto' value={formData.codEquipoTracto ?? ''} onChange={handleChange} required />
        </FormField>
        <FormField label='Carreta (Código)' name='codEquipoCarreta' required>
          <input type='text' name='codEquipoCarreta' value={formData.codEquipoCarreta ?? ''} onChange={handleChange} required />
        </FormField>
        <FormField label='Carreta Tercero' name='carretaTercero'>
          <input type='checkbox' name='carretaTercero' checked={Boolean(formData.carretaTercero)} onChange={handleChange} />
        </FormField>
        <FormField label='ID Personal (Conductor)' name='idPersonal' required>
          <input type='number' name='idPersonal' value={formData.idPersonal ?? ''} onChange={handleChange} required />
        </FormField>
        <FormField label='Tipo' name='tipo'>
          <input type='text' name='tipo' value={formData.tipo ?? ''} onChange={handleChange} />
        </FormField>
        <div className='form-actions'>
          <button type='button' className='btn btn--secondary' onClick={onClose} disabled={loading}>Cancelar</button>
          <button type='submit' className='btn btn--primary' disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
        </div>
      </form>
    </Modal>
  );
}
