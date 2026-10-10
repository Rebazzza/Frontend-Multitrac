import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { Modal } from '../../shared/components/modal';
import { FormField } from '../../shared/components/form-field';
import { Alert } from '../../shared/components/alert';
import { operacionService, type AsignarUnidadesConductoresRequest } from '../../core/services/operacion.service';
import { useLookupMaps } from '../../core/hooks/use-lookup-maps';

interface ApiError { status?: number; message?: string; }

interface Props {
  isOpen: boolean;
  idOperacionGeneral?: number | null;
  convoy?: number | null;
  onClose: () => void;
  onSaved: () => void;
}

export function AsignacionFlotaModal({ isOpen, idOperacionGeneral, convoy, onClose, onSaved }: Props) {
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

  const { maps } = useLookupMaps([
    { key: 'personal', resource: 'Personal', idField: 'idPersonal' },
  ]);
  const personalMap = maps['personal'] ?? new Map<number, Record<string, unknown>>();

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
    setLoading(true); setError(null);
    try {
      await operacionService.asignarUnidadesConductores(formData);
      onSaved();
    } catch (err) {
      const api = err as ApiError;
      setError(api?.message ?? 'Error al asignar convoy');
    } finally { setLoading(false); }
  };

  return (
    <Modal isOpen={isOpen} title='Asignacion de Convoy' onClose={onClose} size='md'>
      <form onSubmit={handleSubmit} className='form-grid'>
        {error && <Alert type='error' message={error} onClose={() => setError(null)} />}
        <FormField label='Tracto' name='codEquipoTracto' required>
          <input type='text' name='codEquipoTracto' value={formData.codEquipoTracto ?? ''} onChange={handleChange} required className='touch-input' />
        </FormField>
        <FormField label='Carreta' name='codEquipoCarreta' required>
          <input type='text' name='codEquipoCarreta' value={formData.codEquipoCarreta ?? ''} onChange={handleChange} required className='touch-input' />
        </FormField>
        <FormField label='Conductor Principal' name='idPersonalConductor' required>
          <select name='idPersonalConductor' value={formData.idPersonalConductor ?? ''} onChange={handleChange} required>
            <option value=''>Seleccione...</option>
            {Array.from(personalMap.values()).map((p: any) => (
              <option key={p.idPersonal} value={p.idPersonal}>{p.nomPersonal} {p.apPersonal}</option>
            ))}
          </select>
        </FormField>
        <div className='form-actions'>
          <button type='button' className='btn btn--secondary touch-btn' onClick={onClose} disabled={loading}>Cancelar</button>
          <button type='submit' className='btn btn--primary touch-btn' disabled={loading}>{loading ? 'Guardando...' : 'Asignar'}</button>
        </div>
      </form>
    </Modal>
  );
}
export { AsignacionFlotaModal as AsignarConvoyModal };

