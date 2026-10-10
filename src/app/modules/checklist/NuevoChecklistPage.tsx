import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Alert } from '../../shared/components/alert';
import { useLookupMaps } from '../../core/hooks/use-lookup-maps';
import { equipoChecklistService } from '../../core/services/equipo-checklist.service';
import type { EquipoChecklistCreateDto, EquipoChecklistItem } from '../../models/equipo-checklist.model';
import './checklist-mobile.css';

interface ApiError { status?: number; message?: string; }

const SECCIONES = [
  { nombre: 'Luces', items: ['Faros delanteros', 'Luces altas/bajas', 'Direccionales', 'Luces de freno', 'Luces reversa'] },
  { nombre: 'Frenos', items: ['Freno de servicio', 'Freno de estacionamiento', 'Sistema de aire'] },
  { nombre: 'Neumáticos', items: ['Presión', 'Estado de bandas', 'Tuercas'] },
  { nombre: 'Motor', items: ['Nivel de aceite', 'Refrigerante', 'Fugas', 'Correas'] },
  { nombre: 'Documentos', items: ['SOAT', 'Revisión Técnica', 'Licencias', 'Tarjeta de Propiedad'] },
  { nombre: 'Botiquín/Seguridad', items: ['Botiquín', 'Extintor', 'Triángulos', 'Cinturones'] },
];

export function NuevoChecklistPage() {
  const [idPersonal, setIdPersonal] = useState<number | ''>('');
  const [codigoTracto, setCodigoTracto] = useState('');
  const [codigoCarreta, setCodigoCarreta] = useState('');
  const [placaTracto, setPlacaTracto] = useState('');
  const [placaCarreta, setPlacaCarreta] = useState('');
  const [kilometraje, setKilometraje] = useState<number | ''>('');
  const [observacionesGenerales, setObservacionesGenerales] = useState('');
  const [items, setItems] = useState<EquipoChecklistItem[]>(() =>
    SECCIONES.flatMap((s) => s.items.map((it) => ({ seccion: s.nombre, item: it, resultado: 'Bueno' as const, requiereFoto: false, fotoUrl: null, observaciones: '' })))
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [toasts, setToasts] = useState<string[]>([]);

  const { maps } = useLookupMaps([
    { key: 'personal', resource: 'Personal', idField: 'idPersonal' },
  ]);
  const personalMap = maps['personal'] ?? new Map<number, Record<string, unknown>>();

  const addToast = (msg: string) => {
    setToasts((prev) => [...prev, msg]);
    setTimeout(() => setToasts((prev) => prev.slice(1)), 3000);
  };

  const handleResultado = (idx: number, resultado: string) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], resultado, requiereFoto: resultado === 'Malo' };
      return copy;
    });
    if (resultado === 'Malo') addToast('Item marcado como Malo - Adjunte foto si es necesario');
  };

  const handleFoto = (idx: number, file: File | null) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setItems((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], fotoUrl: url, requiereFoto: true };
      return copy;
    });
    addToast('Foto adjuntada (progreso simulado)');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null); setSuccess(null);
    try {
      const dto: EquipoChecklistCreateDto = {
        idPersonal: idPersonal === '' ? null : Number(idPersonal),
        codigoTracto,
        codigoCarreta,
        placaTracto,
        placaCarreta,
        kilometraje: kilometraje === '' ? null : Number(kilometraje),
        fecha: new Date().toISOString().slice(0, 10),
        hora: new Date().toTimeString().slice(0, 5),
        resultado: items.some((i) => i.resultado === 'Malo') ? 'Rechazado' : 'Aprobado',
        observaciones: observacionesGenerales,
        items,
      };
      await equipoChecklistService.create(dto);
      setSuccess('Checklist guardado correctamente');
      addToast('Checklist guardado correctamente');
    } catch (err) {
      const api = err as ApiError;
      setError(api?.message ?? 'Error al guardar checklist');
    } finally { setLoading(false); }
  };

  return (
    <div className='checklist-mobile'>
      <div className='operaciones-page__header'><h1>Pre-Operativo</h1></div>
      {error && <Alert type='error' message={error} onClose={() => setError(null)} />}
      {success && <Alert type='success' message={success} onClose={() => setSuccess(null)} />}
      <form onSubmit={handleSubmit} className='checklist-form'>
        <div className='section-card'>
          <h3>Datos del Conductor y Unidad</h3>
          <div className='grid-2'>
            <div>
              <label>Conductor</label>
              <select value={idPersonal} onChange={(e: ChangeEvent<HTMLSelectElement>) => setIdPersonal(e.target.value === '' ? '' : Number(e.target.value))}>
                <option value=''>Seleccione...</option>
                {Array.from(personalMap.values()).map((p: any) => (
                  <option key={p.idPersonal} value={p.idPersonal}>{p.nomPersonal} {p.apPersonal}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Kilometraje</label>
              <input type='number' value={kilometraje} onChange={(e: ChangeEvent<HTMLInputElement>) => setKilometraje(e.target.value === '' ? '' : Number(e.target.value))} className='touch-input' />
            </div>
            <div>
              <label>Tracto (Código/Placa)</label>
              <input type='text' value={codigoTracto} onChange={(e: ChangeEvent<HTMLInputElement>) => setCodigoTracto(e.target.value)} placeholder='Código' className='touch-input' />
              <input type='text' value={placaTracto} onChange={(e: ChangeEvent<HTMLInputElement>) => setPlacaTracto(e.target.value)} placeholder='Placa' className='touch-input' />
            </div>
            <div>
              <label>Carreta (Código/Placa)</label>
              <input type='text' value={codigoCarreta} onChange={(e: ChangeEvent<HTMLInputElement>) => setCodigoCarreta(e.target.value)} placeholder='Código' className='touch-input' />
              <input type='text' value={placaCarreta} onChange={(e: ChangeEvent<HTMLInputElement>) => setPlacaCarreta(e.target.value)} placeholder='Placa' className='touch-input' />
            </div>
          </div>
        </div>
        {SECCIONES.map((s) => (
          <div key={s.nombre} className='section-card'>
            <h3>{s.nombre}</h3>
            {s.items.map((it) => {
              const idx = items.findIndex((x) => x.seccion === s.nombre && x.item === it);
              const val = idx >= 0 ? items[idx].resultado : 'Bueno';
              return (
                <div key={it} className='item-row'>
                  <div>{it}</div>
                  <div className='toggle-group'>
                    {(['Bueno','Malo','NA'] as const).map((r) => (
                      <button key={r} type='button' className={`toggle-btn ${val === r ? 'active' : ''}`} onClick={() => idx >= 0 && handleResultado(idx, r)}>{r}</button>
                    ))}
                  </div>
                  {idx >= 0 && items[idx].requiereFoto && (
                    <div>
                      <input type='file' accept='image/*' capture='environment' onChange={(e: ChangeEvent<HTMLInputElement>) => handleFoto(idx, e.target.files?.[0] ?? null)} className='touch-input' />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
        <div className='section-card'>
          <label>Observaciones Generales</label>
          <textarea value={observacionesGenerales} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setObservacionesGenerales(e.target.value)} rows={3} />
        </div>
        <button type='submit' className='btn-primary touch-btn' disabled={loading}>{loading ? 'Guardando...' : 'Guardar Checklist'}</button>
      </form>
      <div className='toasts'>
        {toasts.map((t, i) => <div key={i} className='toast'>{t}</div>)}
      </div>
    </div>
  );
}

