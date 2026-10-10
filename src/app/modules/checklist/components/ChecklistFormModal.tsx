import { useEffect, useMemo, useState } from 'react';
import { Alert } from '../../../shared/components/alert';
import { FormField } from '../../../shared/components/form-field';
import { Modal } from '../../../shared/components/modal';
import { checklistService } from '../../../core/services/checklist.service';
import { toApiDate } from '../../../core/utils/format';
import type { Personal } from '../../../models/personal.model';
import type {
  ChecklistArea,
  ChecklistEstado,
  ChecklistTipo,
  CrearChecklistDto,
} from '../../../models/checklist.model';
import { AREA_SEGURIDAD_PDP } from '../../../models/checklist.model';
import { normalizarEstado } from './checklist-estado';
import '../../catalogs/catalog-form.css';
interface ChecklistFormModalProps {
  isOpen: boolean;
  areas: ChecklistArea[];
  tipos: ChecklistTipo[];
  estados: ChecklistEstado[];
  personalList: Personal[];
  onSubmit: (values: CrearChecklistDto) => Promise<void>;
  onCancel: () => void;
}

function nombrePersonal(p: Personal): string {
  return (
    [p.apPersonal, p.amPersonal, p.nomPersonal].filter(Boolean).join(' ').trim() ||
    `Personal ${p.idPersonal}`
  );
}

/**
 * CHECKLIST.ESTADO guarda "OBSEVADO" con una S de mas. Se corrige solo en pantalla:
 * tocar el dato historico cambiaria el reporte del sistema legacy.
 */
export function ChecklistFormModal({
  isOpen,
  areas,
  tipos,
  estados,
  personalList,
  onSubmit,
  onCancel,
}: ChecklistFormModalProps) {
  const [idArea, setIdArea] = useState('');
  const [idTipo, setIdTipo] = useState('');
  const [codigo, setCodigo] = useState('');
  const [equipo, setEquipo] = useState('');
  const [acoplado, setAcoplado] = useState('');
  const [kilometraje, setKilometraje] = useState('');
  const [idPersonal, setIdPersonal] = useState('');
  const [idPersonalRevision, setIdPersonalRevision] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [hora, setHora] = useState(new Date().toTimeString().slice(0, 5));
  const [idEstado, setIdEstado] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [extintor01, setExtintor01] = useState('');
  const [extintor02, setExtintor02] = useState('');
  const [ext01Fecha, setExt01Fecha] = useState('');
  const [ext02Fecha, setExt02Fecha] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const areaNumero = Number(idArea) || 0;
  const esSeguridad = areaNumero === AREA_SEGURIDAD_PDP;

  const personalOrdenado = useMemo(
    () =>
      [...personalList]
        .sort((a, b) => nombrePersonal(a).localeCompare(nombrePersonal(b)))
        .map((p) => ({ id: p.idPersonal, label: nombrePersonal(p) })),
    [personalList],
  );

  const tiposVisibles = useMemo(() => {
    if (!areaNumero) return tipos;
    return tipos.filter((t) => t.idAreaMultitrac === areaNumero);
  }, [tipos, areaNumero]);

  // Al cambiar el area se reinician los campos que dependen de ella: el tipo deja de
  // ser valido y el bloque de extintores solo aplica a Seguridad y PdP.
  const handleAreaChange = (value: string) => {
    setIdArea(value);
    setIdTipo('');
    setCodigo('');
    if (Number(value) !== AREA_SEGURIDAD_PDP) {
      setExtintor01('');
      setExtintor02('');
      setExt01Fecha('');
      setExt02Fecha('');
    }
  };

  // El correlativo depende solo del tipo (prefijo M/S + numero), igual que en
  // dbo.FC_CHECKLIST_Codigo_Siguiente. Cambiar el equipo no lo altera.
  useEffect(() => {
    if (!idTipo) return;
    let cancelled = false;
    checklistService
      .getSiguienteCodigo(Number(idTipo))
      .then((valor) => { if (!cancelled) setCodigo(valor); })
      .catch(() => { if (!cancelled) setCodigo(''); });
    return () => { cancelled = true; };
  }, [idTipo]);

  // Autocompleta los extintores con el ultimo registro del equipo, sin pisar lo ya escrito.
  useEffect(() => {
    const cod = equipo.trim();
    if (!esSeguridad || !cod) return;
    let cancelled = false;
    checklistService
      .getUltimoExtintor(cod)
      .then((info) => {
        if (cancelled || !info) return;
        setExtintor01((prev) => prev || info.extintor01 || '');
        setExtintor02((prev) => prev || info.extintor02 || '');
        setExt01Fecha((prev) => prev || (info.ext01Fecha ? info.ext01Fecha.slice(0, 10) : ''));
        setExt02Fecha((prev) => prev || (info.ext02Fecha ? info.ext02Fecha.slice(0, 10) : ''));
      })
      .catch(() => undefined);
    return () => { cancelled = true; };
  }, [equipo, esSeguridad]);

  const reset = () => {
    setIdArea('');
    setIdTipo('');
    setCodigo('');
    setEquipo('');
    setAcoplado('');
    setKilometraje('');
    setIdPersonal('');
    setIdPersonalRevision('');
    setFecha(new Date().toISOString().slice(0, 10));
    setHora(new Date().toTimeString().slice(0, 5));
    setIdEstado('');
    setObservaciones('');
    setExtintor01('');
    setExtintor02('');
    setExt01Fecha('');
    setExt02Fecha('');
    setError('');
  };

  const handleCancel = () => {
    reset();
    onCancel();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!idArea) { setError('Seleccione el area.'); return; }
    if (!idTipo) { setError('Seleccione el tipo de checklist.'); return; }
    if (!equipo.trim()) { setError('Ingrese el codigo del equipo.'); return; }
    if (!fecha) { setError('Ingrese la fecha.'); return; }
    if (!idEstado) { setError('Seleccione el estado del equipo.'); return; }
    if (kilometraje && Number.isNaN(Number(kilometraje))) {
      setError('El kilometraje debe ser un numero.');
      return;
    }
    if (ext01Fecha && ext02Fecha && ext01Fecha > ext02Fecha) {
      setError('La fecha del extintor 01 no puede ser posterior a la del extintor 02.');
      return;
    }

    setSaving(true);
    try {
      await onSubmit({
        codigoChecklist: codigo.trim() || null,
        idChecklistTipo: Number(idTipo),
        idChecklistEstado: Number(idEstado),
        idPersonal: idPersonal ? Number(idPersonal) : null,
        idPersonalRevision: idPersonalRevision ? Number(idPersonalRevision) : null,
        equipo: equipo.trim(),
        acoplado: acoplado.trim() || null,
        kilometraje: kilometraje ? Number(kilometraje) : null,
        fecha: toApiDate(fecha),
        hora: hora || null,
        observaciones: observaciones.trim() || null,
        extintor01: esSeguridad ? extintor01.trim() || null : null,
        extintor02: esSeguridad ? extintor02.trim() || null : null,
        ext01Fecha: esSeguridad && ext01Fecha ? toApiDate(ext01Fecha) : null,
        ext02Fecha: esSeguridad && ext02Fecha ? toApiDate(ext02Fecha) : null,
        idOperacionGeneralEquipo: null,
      });
      reset();
    } catch (err) {
      setError((err as { message?: string })?.message || 'Error al registrar el checklist.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} title="Registrar checklist" onClose={handleCancel} size="lg">
      <form className="catalog-form" onSubmit={handleSubmit} noValidate>
        <FormField label="Area" name="idArea" required>
          <select
            id="idArea"
            value={idArea}
            onChange={(e) => handleAreaChange(e.target.value)}
            autoFocus
          >
            <option value="">Seleccione un area...</option>
            {areas.map((a) => (
              <option key={a.idChecklistArea} value={a.idChecklistArea}>
                {a.nombreArea}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Tipo de checklist" name="idTipo" required>
          <select
            id="idTipo"
            value={idTipo}
            onChange={(e) => { setCodigo(''); setIdTipo(e.target.value); }}
            disabled={!idArea}
          >
            <option value="">{idArea ? 'Seleccione un tipo...' : 'Elija un area primero'}</option>
            {tiposVisibles.map((t) => (
              <option key={t.idCheckListTipo} value={t.idCheckListTipo}>
                {t.nombreTipo}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Codigo correlativo" name="codigoChecklist">
          <input
            id="codigoChecklist"
            type="text"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="Se genera solo segun el tipo"
            maxLength={50}
          />
          <span className="catalog-form__hint">
            Consultado automaticamente al elegir el tipo.
          </span>
        </FormField>

        <FormField label="Equipo (tracto)" name="equipo" required>
          <input
            id="equipo"
            type="text"
            value={equipo}
            onChange={(e) => setEquipo(e.target.value.toUpperCase())}
            placeholder="Ej. T8G-826"
            maxLength={10}
          />
          <span className="catalog-form__hint">
            Alimenta la busqueda del ultimo extintor.
          </span>
        </FormField>

        <FormField label="Acoplado (carreta)" name="acoplado">
          <input
            id="acoplado"
            type="text"
            value={acoplado}
            onChange={(e) => setAcoplado(e.target.value.toUpperCase())}
            placeholder="Ej. TPH-993"
            maxLength={10}
          />
        </FormField>

        <FormField label="Kilometraje" name="kilometraje">
          <input
            id="kilometraje"
            type="number"
            step="0.01"
            min="0"
            value={kilometraje}
            onChange={(e) => setKilometraje(e.target.value)}
            placeholder="Opcional"
          />
        </FormField>

        <FormField label="Conductor" name="idPersonal">
          <select id="idPersonal" value={idPersonal} onChange={(e) => setIdPersonal(e.target.value)}>
            <option value="">Seleccione un conductor...</option>
            {personalOrdenado.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
        </FormField>

        <FormField
          label="Revisor"
          name="idPersonalRevision"
          required
        >
          <select
            id="idPersonalRevision"
            value={idPersonalRevision}
            onChange={(e) => setIdPersonalRevision(e.target.value)}
          >
            <option value="">Seleccione un revisor...</option>
            {personalOrdenado.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
          <span className="catalog-form__hint">
            La app no expone el id del usuario autenticado, asi que se elige de PERSONAL.
          </span>
        </FormField>

        <FormField label="Fecha" name="fecha" required>
          <input id="fecha" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
        </FormField>

        <FormField label="Hora" name="hora">
          <input id="hora" type="time" value={hora} onChange={(e) => setHora(e.target.value)} />
        </FormField>

        <FormField label="Estado del equipo" name="idEstado" required>
          <select id="idEstado" value={idEstado} onChange={(e) => setIdEstado(e.target.value)}>
            <option value="">Seleccione un estado...</option>
            {estados.map((s) => (
              <option key={s.idEstadoCheckList} value={s.idEstadoCheckList}>
                {normalizarEstado(s.estadoCheckList)}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Observaciones" name="observaciones">
          <textarea
            id="observaciones"
            rows={3}
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            placeholder="Opcional"
          />
        </FormField>

        {esSeguridad && (
          <>
            <div className="checklist-extintores">
              <h3 className="checklist-extintores__title">Extintores</h3>
              <span className="catalog-form__hint">
                Se autocompletan con el ultimo registro del equipo al escribir el codigo.
              </span>

              <FormField label="Extintor 01 - codigo" name="extintor01">
                <input
                  id="extintor01"
                  type="text"
                  value={extintor01}
                  onChange={(e) => setExtintor01(e.target.value)}
                  maxLength={20}
                  placeholder="Opcional"
                />
              </FormField>

              <FormField label="Extintor 01 - fecha de cadencia" name="ext01Fecha">
                <input
                  id="ext01Fecha"
                  type="date"
                  value={ext01Fecha}
                  onChange={(e) => setExt01Fecha(e.target.value)}
                />
              </FormField>

              <FormField label="Extintor 02 - codigo" name="extintor02">
                <input
                  id="extintor02"
                  type="text"
                  value={extintor02}
                  onChange={(e) => setExtintor02(e.target.value)}
                  maxLength={20}
                  placeholder="Opcional"
                />
              </FormField>

              <FormField label="Extintor 02 - fecha de cadencia" name="ext02Fecha">
                <input
                  id="ext02Fecha"
                  type="date"
                  value={ext02Fecha}
                  onChange={(e) => setExt02Fecha(e.target.value)}
                />
              </FormField>
            </div>
          </>
        )}

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        <div className="catalog-form__actions">
          <button type="button" className="btn btn--secondary" onClick={handleCancel}>
            Cancelar
          </button>
          <button type="submit" className="btn btn--primary" disabled={saving}>
            {saving ? 'Registrando...' : 'Registrar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
