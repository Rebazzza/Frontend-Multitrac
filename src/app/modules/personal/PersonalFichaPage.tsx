import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert } from '../../shared/components/alert';
import { FormField } from '../../shared/components/form-field';
import { Modal } from '../../shared/components/modal';
import { DataTable, type Column } from '../../shared/components/data-table';
import { ConfirmDialog } from '../../shared/components/confirm-dialog';
import { personalService } from '../../core/services/personal.service';
import type { Personal } from '../../models/personal.model';
import type { PersonalCargo } from '../../models/personal-cargo.model';
import type { PersonalEquipo } from '../../models/personal-equipo.model';
import type { Contratista } from '../../models/contratista.model';
import type { Afp } from '../../models/afp.model';
import type { NivelEducativo } from '../../models/nivel-educativo.model';
import type { ApiError } from '../../core/interceptors/error.interceptor';
import './PersonalFichaPage.css';

type Tab = 'datos' | 'cargo' | 'equipo';

const SEXOS = ['M', 'F'];
const ESTADOS_CIVIL = ['Soltero', 'Casado', 'Divorciado', 'Viudo', 'Conviviente'];
const ESTADOS_OP = [
  { value: '0', label: '0 - Activo' },
  { value: '1', label: '1 - Inactivo' },
];

function formatDate(value?: string | null): string {
  if (!value) return '';
  return value.slice(0, 10);
}

export function PersonalFichaPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const esNuevo = id === 'nuevo' || !id;
  const personalId = esNuevo ? null : Number(id);

  const [form, setForm] = useState<Partial<Personal>>({});
  const [contratistas, setContratistas] = useState<Contratista[]>([]);
  const [afps, setAfps] = useState<Afp[]>([]);
  const [niveles, setNiveles] = useState<NivelEducativo[]>([]);
  const [cargos, setCargos] = useState<Record<string, unknown>[]>([]);
  const [cargosPersonal, setCargosPersonal] = useState<PersonalCargo[]>([]);
  const [equipos, setEquipos] = useState<PersonalEquipo[]>([]);
  const [tab, setTab] = useState<Tab>('datos');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteCargo, setDeleteCargo] = useState<PersonalCargo | null>(null);
  const [deleteEquipo, setDeleteEquipo] = useState<PersonalEquipo | null>(null);
  const [showCargoForm, setShowCargoForm] = useState(false);
  const [showEquipoForm, setShowEquipoForm] = useState(false);

  const loadAux = async () => {
    try {
      const [cont, afp, niv, car, pc, eq] = await Promise.all([
        personalService.getContratistas(),
        personalService.getAfps(),
        personalService.getNivelesEducativos(),
        personalService.getCargos(),
        personalService.getCargosPersonal(),
        personalService.getPersonalEquipos(),
      ]);
      setContratistas(cont);
      setAfps(afp);
      setNiveles(niv);
      setCargos(car);
      setCargosPersonal(pc);
      setEquipos(eq);
    } catch {
      // silencioso: los catálogos se pueden cargar sin datos
    }
  };

  useEffect(() => {
    void loadAux();
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (personalId == null) return;
    const fetch = async () => {
      setLoading(true);
      setError('');
      try {
        const personal = await personalService.getById(personalId);
        if (!cancelled) setForm(personal);
      } catch (err) {
        if (!cancelled) {
          const apiError = err as ApiError;
          setError(apiError.message || 'Error al cargar el personal');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetch();
    return () => { cancelled = true; };
  }, [personalId]);

  const handleField = (key: keyof Personal, value: string | number | null) => {
    setForm((prev) => ({ ...prev, [key]: value === '' ? null : value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      if (personalId == null) {
        const created = await personalService.create(form);
        navigate(`/personal/${created.idPersonal}`);
      } else {
        await personalService.update(personalId, form as Personal);
      }
      setSuccess('Personal guardado correctamente.');
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Error al guardar el personal');
    } finally {
      setSaving(false);
    }
  };

  const cargosPersona = useMemo(
    () => cargosPersonal.filter((c) => String(c.idPersonal) === String(personalId)),
    [cargosPersonal, personalId],
  );
  const equiposPersona = useMemo(
    () => equipos.filter((e) => String(e.idPersonal) === String(personalId)),
    [equipos, personalId],
  );

  const cargoNombre = (idCargo?: number | null): string => {
    if (idCargo == null) return '—';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const c = cargos.find((c: any) => Number(c.idCargo) === Number(idCargo));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return c ? ((c as any).tituloCargo || (c as any).crgNom || String(idCargo)) : String(idCargo);
  };

  const cargoColumns: Column<PersonalCargo>[] = [
    { key: 'idPersonalCargo', header: 'ID Cargo Asig.' },
    { key: 'idCargo', header: 'Cargo', render: (item) => <span>{cargoNombre(item.idCargo)}</span> },
    { key: 'fechaInicioCargo', header: 'Fecha Inicio' },
    { key: 'fechaFinCargo', header: 'Fecha Fin' },
    { key: 'estado', header: 'Estado' },
  ];

  const equipoColumns: Column<PersonalEquipo>[] = [
    { key: 'idPersonalEquipo', header: 'ID' },
    { key: 'codEquipo', header: 'Código Equipo' },
    { key: 'fechIni', header: 'Fecha Inicio' },
    { key: 'fechFin', header: 'Fecha Fin' },
    { key: 'estado', header: 'Estado' },
  ];

  const handleConfirmDeleteCargo = async () => {
    if (!deleteCargo) return;
    try {
      await personalService.removePersonalCargo(deleteCargo.idPersonalCargo);
      setCargosPersonal((prev) => prev.filter((c) => c.idPersonalCargo !== deleteCargo.idPersonalCargo));
      setDeleteCargo(null);
      setSuccess('Cargo eliminado correctamente.');
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Error al eliminar cargo');
      setDeleteCargo(null);
    }
  };

  const handleConfirmDeleteEquipo = async () => {
    if (!deleteEquipo) return;
    try {
      await personalService.removePersonalEquipo(deleteEquipo.idPersonalEquipo);
      setEquipos((prev) => prev.filter((e) => e.idPersonalEquipo !== deleteEquipo.idPersonalEquipo));
      setDeleteEquipo(null);
      setSuccess('Equipo eliminado correctamente.');
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Error al eliminar equipo');
      setDeleteEquipo(null);
    }
  };

  const renderDatosGenerales = () => (
    <div className="ficha">
      <div className="ficha__grid">
        <FormField label="Código" name="empCod">
          <input
            type="number"
            value={form.empCod ?? ''}
            onChange={(e) => handleField('empCod', e.target.value === '' ? null : Number(e.target.value))}
          />
        </FormField>
        <FormField label="DNI" name="dniPersonal">
          <input value={form.dniPersonal ?? ''} onChange={(e) => handleField('dniPersonal', e.target.value)} />
        </FormField>
        <FormField label="Apellido Paterno" name="apPersonal">
          <input value={form.apPersonal ?? ''} onChange={(e) => handleField('apPersonal', e.target.value)} />
        </FormField>
        <FormField label="Apellido Materno" name="amPersonal">
          <input value={form.amPersonal ?? ''} onChange={(e) => handleField('amPersonal', e.target.value)} />
        </FormField>
        <FormField label="Nombres" name="nomPersonal">
          <input value={form.nomPersonal ?? ''} onChange={(e) => handleField('nomPersonal', e.target.value)} />
        </FormField>
        <FormField label="Sexo" name="sexoPersonal">
          <select
            value={form.sexoPersonal ?? ''}
            onChange={(e) => handleField('sexoPersonal', e.target.value)}
          >
            <option value="">-- Seleccionar --</option>
            {SEXOS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </FormField>
        <FormField label="Estado Civil" name="estadoCivilPersonal">
          <select
            value={form.estadoCivilPersonal ?? ''}
            onChange={(e) => handleField('estadoCivilPersonal', e.target.value)}
          >
            <option value="">-- Seleccionar --</option>
            {ESTADOS_CIVIL.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </FormField>
        <FormField label="Fecha Nacimiento" name="fechNacPersonal">
          <input
            type="date"
            value={formatDate(form.fechNacPersonal)}
            onChange={(e) => handleField('fechNacPersonal', e.target.value || null)}
          />
        </FormField>
        <FormField label="Fecha Ingreso" name="fechaAdmitidoPersonal">
          <input
            type="date"
            value={formatDate(form.fechaAdmitidoPersonal)}
            onChange={(e) => handleField('fechaAdmitidoPersonal', e.target.value || null)}
          />
        </FormField>
        <FormField label="Fecha Baja" name="fechaBajaPersonal">
          <input
            type="date"
            value={formatDate(form.fechaBajaPersonal)}
            onChange={(e) => handleField('fechaBajaPersonal', e.target.value || null)}
          />
        </FormField>
        <FormField label="Estado Personal" name="statusOp">
          <select
            value={form.statusOp != null ? String(form.statusOp) : '0'}
            onChange={(e) => handleField('statusOp', e.target.value === '' ? null : Number(e.target.value))}
          >
            {ESTADOS_OP.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </FormField>
        <FormField label="Contratista / Empresa" name="idContratista">
          <select
            value={form.idContratista ?? ''}
            onChange={(e) => handleField('idContratista', e.target.value === '' ? null : Number(e.target.value))}
          >
            <option value="">-- Seleccionar --</option>
            {contratistas.map((c) => (
              <option key={c.idContratista} value={c.idContratista}>
                {c.razonSocialContratista || [c.apContratista, c.amContratista, c.nomContratista].filter(Boolean).join(' ') || `#${c.idContratista}`}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Nivel Educativo" name="idNivelEducativo">
          <select
            value={form.idNivelEducativo ?? ''}
            onChange={(e) => handleField('idNivelEducativo', e.target.value === '' ? null : Number(e.target.value))}
          >
            <option value="">-- Seleccionar --</option>
            {niveles.map((n) => (
              <option key={n.idNivelEducativo} value={n.idNivelEducativo}>
                {n.descripcionNivelEducativo || `#${n.idNivelEducativo}`}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="AFP" name="afpPersonal">
          <select
            value={form.afpPersonal ?? ''}
            onChange={(e) => handleField('afpPersonal', e.target.value === '' ? null : Number(e.target.value))}
          >
            <option value="">-- Seleccionar --</option>
            {afps.map((a) => (
              <option key={a.idAfp} value={a.idAfp}>
                {a.nomAfp || `#${a.idAfp}`}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Fecha Ingreso AFP" name="fechaIngresoAfp">
          <input
            type="date"
            value={formatDate(form.fechaIngresoAfp)}
            onChange={(e) => handleField('fechaIngresoAfp', e.target.value || null)}
          />
        </FormField>
        <FormField label="Brevete / Licencia" name="licPersonal">
          <input value={form.licPersonal ?? ''} onChange={(e) => handleField('licPersonal', e.target.value)} />
        </FormField>
        <FormField label="Pasaporte" name="pasaportePersonal">
          <input value={form.pasaportePersonal ?? ''} onChange={(e) => handleField('pasaportePersonal', e.target.value)} />
        </FormField>
        <FormField label="Celular" name="celPersonal">
          <input value={form.celPersonal ?? ''} onChange={(e) => handleField('celPersonal', e.target.value)} />
        </FormField>
        <FormField label="Teléfono Fijo" name="tlfPesronal">
          <input value={form.tlfPesronal ?? ''} onChange={(e) => handleField('tlfPesronal', e.target.value)} />
        </FormField>
        <FormField label="RPC" name="rpcPersonal">
          <input value={form.rpcPersonal ?? ''} onChange={(e) => handleField('rpcPersonal', e.target.value)} />
        </FormField>
        <FormField label="RPM" name="rpmPersonal">
          <input value={form.rpmPersonal ?? ''} onChange={(e) => handleField('rpmPersonal', e.target.value)} />
        </FormField>
        <FormField label="Email" name="emailPersonal">
          <input value={form.emailPersonal ?? ''} onChange={(e) => handleField('emailPersonal', e.target.value)} />
        </FormField>
        <FormField label="Lugar Nacimiento" name="lugarNacimientoPersonal">
          <input value={form.lugarNacimientoPersonal ?? ''} onChange={(e) => handleField('lugarNacimientoPersonal', e.target.value)} />
        </FormField>
        <FormField label="Lugar Residencia" name="lugarResidenciaPersonal">
          <input value={form.lugarResidenciaPersonal ?? ''} onChange={(e) => handleField('lugarResidenciaPersonal', e.target.value)} />
        </FormField>
        <FormField label="Dirección" name="direccionPersonal">
          <input value={form.direccionPersonal ?? ''} onChange={(e) => handleField('direccionPersonal', e.target.value)} />
        </FormField>
        <FormField label="CUSSP" name="cussp">
          <input value={form.cussp ?? ''} onChange={(e) => handleField('cussp', e.target.value)} />
        </FormField>
        <FormField label="ESSALUD" name="esaludAutoGenerado">
          <input value={form.esaludAutoGenerado ?? ''} onChange={(e) => handleField('esaludAutoGenerado', e.target.value)} />
        </FormField>
        <FormField label="SCTR" name="sctr">
          <input value={form.sctr ?? ''} onChange={(e) => handleField('sctr', e.target.value)} />
        </FormField>
        <FormField label="Usuario" name="usuarioPersonal">
          <input value={form.usuarioPersonal ?? ''} onChange={(e) => handleField('usuarioPersonal', e.target.value)} />
        </FormField>
        <FormField label="Sueldo Bruto" name="sueldoBrutoPersonal">
          <input
            type="number"
            step="0.01"
            value={form.sueldoBrutoPersonal ?? ''}
            onChange={(e) => handleField('sueldoBrutoPersonal', e.target.value === '' ? null : Number(e.target.value))}
          />
        </FormField>
      </div>
    </div>
  );

  const renderCargo = () => (
    <div>
      <div className="ficha__toolbar">
        <button type="button" className="btn btn--primary" onClick={() => setShowCargoForm(true)}>
          Asignar Cargo
        </button>
      </div>
      {cargosPersona.length === 0 ? (
        <div className="ficha__empty">No tiene cargos asignados.</div>
      ) : (
        <DataTable
          columns={cargoColumns as unknown as Column<Record<string, unknown>>[]}
          data={cargosPersona as unknown as Record<string, unknown>[]}
          onDelete={(item) => setDeleteCargo(item as unknown as PersonalCargo)}
        />
      )}
    </div>
  );

  const renderEquipo = () => (
    <div>
      <div className="ficha__toolbar">
        <button type="button" className="btn btn--primary" onClick={() => setShowEquipoForm(true)}>
          Asignar Equipo
        </button>
      </div>
      {equiposPersona.length === 0 ? (
        <div className="ficha__empty">No tiene equipos asignados.</div>
      ) : (
        <DataTable
          columns={equipoColumns as unknown as Column<Record<string, unknown>>[]}
          data={equiposPersona as unknown as Record<string, unknown>[]}
          onDelete={(item) => setDeleteEquipo(item as unknown as PersonalEquipo)}
        />
      )}
    </div>
  );

  if (loading) {
    return <div className="personal-page__loading">Cargando ficha...</div>;
  }

  return (
    <div className="ficha-page">
      <div className="ficha-page__header">
        <h1 className="ficha-page__title">
          {esNuevo ? 'Nuevo Personal' : `Ficha de Personal #${personalId}`}
        </h1>
        <div className="ficha-page__actions">
          <button type="button" className="btn btn--secondary" onClick={() => navigate('/personal')}>
            Volver a la lista
          </button>
          {tab === 'datos' && (
            <button type="button" className="btn btn--primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          )}
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      {!esNuevo && (
        <div className="ficha-page__tabs">
          <button
            type="button"
            className={`ficha-page__tab ${tab === 'datos' ? 'ficha-page__tab--active' : ''}`}
            onClick={() => setTab('datos')}
          >
            DATOS GENERALES
          </button>
          <button
            type="button"
            className={`ficha-page__tab ${tab === 'cargo' ? 'ficha-page__tab--active' : ''}`}
            onClick={() => setTab('cargo')}
          >
            CARGO
          </button>
          <button
            type="button"
            className={`ficha-page__tab ${tab === 'equipo' ? 'ficha-page__tab--active' : ''}`}
            onClick={() => setTab('equipo')}
          >
            EQUIPO
          </button>
        </div>
      )}

      <div className="ficha-page__content">
        {tab === 'datos' && renderDatosGenerales()}
        {tab === 'cargo' && renderCargo()}
        {tab === 'equipo' && renderEquipo()}
      </div>

      <ConfirmDialog
        isOpen={!!deleteCargo}
        title="Eliminar cargo"
        message="¿Está seguro de eliminar este cargo del personal?"
        confirmLabel="Eliminar"
        onConfirm={handleConfirmDeleteCargo}
        onCancel={() => setDeleteCargo(null)}
      />
      <ConfirmDialog
        isOpen={!!deleteEquipo}
        title="Eliminar equipo"
        message="¿Está seguro de eliminar esta asignación de equipo?"
        confirmLabel="Eliminar"
        onConfirm={handleConfirmDeleteEquipo}
        onCancel={() => setDeleteEquipo(null)}
      />
      {showCargoForm && personalId != null && (
        <PersonalCargoFormModal
          personalId={personalId}
          cargos={cargos}
          onCancel={() => setShowCargoForm(false)}
          onSaved={(cargo) => {
            setCargosPersonal((prev) => [...prev, cargo]);
            setShowCargoForm(false);
            setSuccess('Cargo asignado correctamente.');
          }}
        />
      )}
      {showEquipoForm && personalId != null && (
        <PersonalEquipoFormModal
          personalId={personalId}
          onCancel={() => setShowEquipoForm(false)}
          onSaved={(equipo) => {
            setEquipos((prev) => [...prev, equipo]);
            setShowEquipoForm(false);
            setSuccess('Equipo asignado correctamente.');
          }}
        />
      )}
    </div>
  );
}

interface PersonalCargoFormModalProps {
  personalId: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cargos: any[];
  onCancel: () => void;
  onSaved: (cargo: PersonalCargo) => void;
}

function PersonalCargoFormModal({ personalId, cargos, onCancel, onSaved }: PersonalCargoFormModalProps) {
  const [form, setForm] = useState<Partial<PersonalCargo>>({ idPersonal: personalId, estado: 'A' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setSaving(true);
    setError('');
    try {
      const cargo = await personalService.createPersonalCargo(form as Partial<PersonalCargo>);
      onSaved(cargo);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Error al asignar cargo');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen title="Asignar Cargo" onClose={onCancel}>
      {error && <Alert type="error" message={error} />}
      <div className="ficha__grid">
        <FormField label="Cargo" name="cargo-select" required>
          <select
            value={form.idCargo ?? ''}
            onChange={(e) => setForm((prev) => ({ ...prev, idCargo: e.target.value === '' ? undefined : Number(e.target.value) }))}
          >
            <option value="">-- Seleccionar --</option>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {cargos.map((c: any) => (
              <option key={c.idCargo} value={c.idCargo}>
                {c.tituloCargo || c.crgNom || `#${c.idCargo}`}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Fecha Inicio" name="fechaInicioCargo">
          <input
            type="date"
            value={form.fechaInicioCargo ?? ''}
            onChange={(e) => setForm((prev) => ({ ...prev, fechaInicioCargo: e.target.value || null }))}
          />
        </FormField>
        <FormField label="Fecha Fin" name="fechaFinCargo">
          <input
            type="date"
            value={form.fechaFinCargo ?? ''}
            onChange={(e) => setForm((prev) => ({ ...prev, fechaFinCargo: e.target.value || null }))}
          />
        </FormField>
        <FormField label="Estado" name="cargo-estado">
          <select value={form.estado ?? 'A'} onChange={(e) => setForm((prev) => ({ ...prev, estado: e.target.value }))}>
            <option value="A">A - Activo</option>
            <option value="I">I - Inactivo</option>
          </select>
        </FormField>
      </div>
      <div className="catalog-form__actions">
        <button type="button" className="btn btn--secondary" onClick={onCancel}>Cancelar</button>
        <button type="button" className="btn btn--primary" onClick={handleSubmit} disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </Modal>
  );
}

interface PersonalEquipoFormModalProps {
  personalId: number;
  onCancel: () => void;
  onSaved: (equipo: PersonalEquipo) => void;
}

function PersonalEquipoFormModal({ personalId, onCancel, onSaved }: PersonalEquipoFormModalProps) {
  const [form, setForm] = useState<Partial<PersonalEquipo>>({ idPersonal: personalId, estado: 'A' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setSaving(true);
    setError('');
    try {
      const equipo = await personalService.createPersonalEquipo(form);
      onSaved(equipo);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Error al asignar equipo');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen title="Asignar Equipo" onClose={onCancel}>
      {error && <Alert type="error" message={error} />}
      <div className="ficha__grid">
        <FormField label="Código Equipo" name="codEquipo" required>
          <input value={form.codEquipo ?? ''} onChange={(e) => setForm((prev) => ({ ...prev, codEquipo: e.target.value }))} />
        </FormField>
        <FormField label="Fecha Inicio" name="fechIni">
          <input
            type="date"
            value={form.fechIni ?? ''}
            onChange={(e) => setForm((prev) => ({ ...prev, fechIni: e.target.value || null }))}
          />
        </FormField>
        <FormField label="Fecha Fin" name="fechFin">
          <input
            type="date"
            value={form.fechFin ?? ''}
            onChange={(e) => setForm((prev) => ({ ...prev, fechFin: e.target.value || null }))}
          />
        </FormField>
        <FormField label="ID Reemplazo" name="idRemplazo">
          <input
            type="number"
            value={form.idRemplazo ?? ''}
            onChange={(e) => setForm((prev) => ({ ...prev, idRemplazo: e.target.value === '' ? null : Number(e.target.value) }))}
          />
        </FormField>
        <FormField label="Estado" name="equipo-estado">
          <select value={form.estado ?? 'A'} onChange={(e) => setForm((prev) => ({ ...prev, estado: e.target.value }))}>
            <option value="A">A - Activo</option>
            <option value="I">I - Inactivo</option>
          </select>
        </FormField>
      </div>
      <div className="catalog-form__actions">
        <button type="button" className="btn btn--secondary" onClick={onCancel}>Cancelar</button>
        <button type="button" className="btn btn--primary" onClick={handleSubmit} disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </Modal>
  );
}