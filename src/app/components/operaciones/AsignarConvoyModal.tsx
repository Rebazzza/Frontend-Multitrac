import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { Modal } from '../../shared/components/modal';
import { FormField } from '../../shared/components/form-field';
import { Alert } from '../../shared/components/alert';
import { operacionService, type AsignarUnidadesConductoresRequest } from '../../core/services/operacion.service';

interface ApiError {
  status?: number;
  message?: string;
}

interface AsignarConvoyModalProps {
  isOpen: boolean;
  idOperacionGeneral?: number | null;
  convoy?: number | null;
  onClose: () => void;
  onSaved: () => void;
}

export function AsignarConvoyModal({ isOpen, idOperacionGeneral, convoy, onClose, onSaved }: AsignarConvoyModalProps) {
  const [formData, setFormData] = useState<AsignarUnidadesConductoresRequest>({
    idOperacionGeneral: idOperacionGeneral ?? undefined,
    convoy: convoy ?? undefined,
    codEquipoTracto: '',
    codEquipoCarreta: '',
    idPersonalConductor: undefined,
    idPersonalCopiloto: undefined,
    carretaTercero: false,
    tipo: '',
    posicion: undefined,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFormData({
      idOperacionGeneral: idOperacionGeneral ?? undefined,
      convoy: convoy ?? undefined,
      codEquipoTracto: '',
      codEquipoCarreta: '',
      idPersonalConductor: undefined,
      idPersonalCopiloto: undefined,
      carretaTercero: false,
      tipo: '',
      posicion: undefined,
    });
    setError(null);
  }, [idOperacionGeneral, convoy, isOpen]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value === '' ? undefined : ['convoy', 'posicion', 'idPersonalConductor', 'idPersonalCopiloto', 'idOperacionGeneral'].includes(name) ? Number(value) : value,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await operacionService.asignarUnidadesConductores(formData);
      onSaved();
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError?.message ?? 'Error al asignar convoy');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} title='Asignación de Convoy' onClose={onClose} size='md'>
      <form onSubmit={handleSubmit} className='form-grid'>
        {error && <Alert type='error' message={error} onClose={() => setError(null)} />}
        <FormField label='Tracto' name='codEquipoTracto' required>
          <input type='text' name='codEquipoTracto' value={formData.codEquipoTracto ?? ''} onChange={handleChange} required placeholder='Código de tracto habilitado' />
        </FormField>
        <FormField label='Carreta' name='codEquipoCarreta' required>
          <input type='text' name='codEquipoCarreta' value={formData.codEquipoCarreta ?? ''} onChange={handleChange} required placeholder='Código de carreta habilitada' />
        </FormField>
        <FormField label='Conductor Principal' name='idPersonalConductor' required>
          <input type='number' name='idPersonalConductor' value={formData.idPersonalConductor ?? ''} onChange={handleChange} required placeholder='ID de conductor habilitado' />
        </FormField>
        <FormField label='Copiloto' name='idPersonalCopiloto'>
          <input type='number' name='idPersonalCopiloto' value={formData.idPersonalCopiloto ?? ''} onChange={handleChange} placeholder='ID de copiloto habilitado' />
        </FormField>
        <FormField label='Carreta Tercero' name='carretaTercero'>
          <input type='checkbox' name='carretaTercero' checked={Boolean(formData.carretaTercero)} onChange={handleChange} />
        </FormField>
        <FormField label='Posición' name='posicion'>
          <input type='number' name='posicion' value={formData.posicion ?? ''} onChange={handleChange} />
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
