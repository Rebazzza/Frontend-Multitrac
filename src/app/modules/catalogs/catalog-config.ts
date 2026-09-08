import { createCatalogService } from '../../core/services/catalog.service';
import type { Column } from '../../shared/components/data-table';
import type { Moneda } from '../../models/moneda.model';
import type { Banco } from '../../models/banco.model';
import type { Cargo } from '../../models/cargo.model';
import type { NivelEducativo } from '../../models/nivel-educativo.model';
import type { Afp } from '../../models/afp.model';
import type { Flota } from '../../models/flota.model';
import type { Actividad } from '../../models/actividad.model';
import type { Turno } from '../../models/turno.model';
import type { TipoPago } from '../../models/tipo-pago.model';
import type { TipoOcurrencia } from '../../models/tipo-ocurrencia.model';

export interface FieldConfig {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'select';
  required?: boolean;
  options?: { value: string; label: string }[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface CatalogConfig {
  resource: string;
  title: string;
  columns: Column<any>[];
  fields: FieldConfig[];
  defaultSort?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  service: ReturnType<typeof createCatalogService<any>>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const catalogConfigs: Record<string, CatalogConfig> = {
  monedas: {
    resource: 'moneda',
    title: 'Monedas',
    defaultSort: 'nombreMoneda',
    service: createCatalogService<Moneda>('moneda'),
    columns: [
      { key: 'idMoneda', header: 'ID', sortable: true },
      { key: 'nombreMoneda', header: 'Nombre', sortable: true },
      { key: 'abreviaturaMoneda', header: 'Abreviatura', sortable: true },
    ],
    fields: [
      { key: 'nombreMoneda', label: 'Nombre', type: 'text', required: true },
      { key: 'abreviaturaMoneda', label: 'Abreviatura', type: 'text' },
    ],
  },

  bancos: {
    resource: 'banco',
    title: 'Bancos',
    defaultSort: 'bancoNombre',
    service: createCatalogService<Banco>('banco'),
    columns: [
      { key: 'idBanco', header: 'ID', sortable: true },
      { key: 'bancoNombre', header: 'Nombre', sortable: true },
      { key: 'observaciones', header: 'Observaciones' },
    ],
    fields: [
      { key: 'bancoNombre', label: 'Nombre', type: 'text', required: true },
      { key: 'observaciones', label: 'Observaciones', type: 'text' },
    ],
  },

  cargos: {
    resource: 'cargo',
    title: 'Cargos',
    defaultSort: 'tituloCargo',
    service: createCatalogService<Cargo>('cargo'),
    columns: [
      { key: 'idCargo', header: 'ID', sortable: true },
      { key: 'tituloCargo', header: 'Título', sortable: true },
      { key: 'descripcionCargo', header: 'Descripción' },
      { key: 'crgCod', header: 'Código' },
      { key: 'areCod', header: 'Área' },
      { key: 'crgNom', header: 'Nombre' },
      { key: 'crgCer', header: 'CER' },
      { key: 'crgAdc', header: 'ADC' },
      { key: 'crgExp', header: 'Experiencia' },
      { key: 'crgPer', header: 'Periodo' },
      { key: 'crgObs', header: 'Observaciones' },
      { key: 'ctrlAsist', header: 'Control Asistencia' },
    ],
    fields: [
      { key: 'tituloCargo', label: 'Título', type: 'text', required: true },
      { key: 'crgCod', label: 'Código', type: 'number' },
      { key: 'areCod', label: 'Código de Área', type: 'number' },
      { key: 'crgNom', label: 'Nombre', type: 'text' },
      { key: 'descripcionCargo', label: 'Descripción', type: 'text' },
      { key: 'crgCer', label: 'CER', type: 'text' },
      { key: 'crgAdc', label: 'ADC', type: 'text' },
      { key: 'crgExp', label: 'Experiencia', type: 'text' },
      { key: 'crgPer', label: 'Periodo', type: 'text' },
      { key: 'crgObs', label: 'Observaciones', type: 'text' },
      { key: 'ctrlAsist', label: 'Control Asistencia', type: 'text' },
    ],
  },

  nivelesEducativos: {
    resource: 'niveleducativo',
    title: 'Niveles Educativos',
    defaultSort: 'descripcionNivelEducativo',
    service: createCatalogService<NivelEducativo>('niveleducativo'),
    columns: [
      { key: 'idNivelEducativo', header: 'ID', sortable: true },
      { key: 'codInterno', header: 'Código Interno' },
      { key: 'descripcionNivelEducativo', header: 'Descripción', sortable: true },
      { key: 'idGradoInstruccion', header: 'Grado Instrucción' },
    ],
    fields: [
      { key: 'codInterno', label: 'Código Interno', type: 'number' },
      { key: 'descripcionNivelEducativo', label: 'Descripción', type: 'text', required: true },
      { key: 'idGradoInstruccion', label: 'ID Grado Instrucción', type: 'number' },
    ],
  },

  afps: {
    resource: 'afp',
    title: 'AFPs',
    defaultSort: 'nomAfp',
    service: createCatalogService<Afp>('afp'),
    columns: [
      { key: 'idAfp', header: 'ID', sortable: true },
      { key: 'codigoExcel', header: 'Código Excel' },
      { key: 'nomAfp', header: 'Nombre', sortable: true },
      { key: 'comision', header: 'Comisión' },
      { key: 'estado', header: 'Estado' },
      { key: 'observacion', header: 'Observación' },
    ],
    fields: [
      { key: 'codigoExcel', label: 'Código Excel', type: 'text' },
      { key: 'nomAfp', label: 'Nombre', type: 'text', required: true },
      { key: 'comision', label: 'Comisión', type: 'number' },
      { key: 'estado', label: 'Estado', type: 'text' },
      { key: 'observacion', label: 'Observación', type: 'text' },
    ],
  },

  flotas: {
    resource: 'flota',
    title: 'Flotas',
    defaultSort: 'descFlota',
    service: createCatalogService<Flota>('flota'),
    columns: [
      { key: 'idFlota', header: 'ID', sortable: true },
      { key: 'descFlota', header: 'Descripción', sortable: true },
      { key: 'nivel', header: 'Nivel' },
      { key: 'budget', header: 'Budget' },
      { key: 'tipo', header: 'Tipo' },
      { key: 'persEq', header: 'Pers/Eq' },
    ],
    fields: [
      { key: 'descFlota', label: 'Descripción', type: 'text', required: true },
      { key: 'nivel', label: 'Nivel', type: 'text' },
      { key: 'budget', label: 'Budget', type: 'text' },
      { key: 'tipo', label: 'Tipo', type: 'text' },
      { key: 'persEq', label: 'Pers/Eq', type: 'text' },
    ],
  },

  actividades: {
    resource: 'actividad',
    title: 'Actividades',
    defaultSort: 'descripcion',
    service: createCatalogService<Actividad>('actividad'),
    columns: [
      { key: 'idActividad', header: 'ID', sortable: true },
      { key: 'descripcion', header: 'Descripción', sortable: true },
    ],
    fields: [
      { key: 'descripcion', label: 'Descripción', type: 'text', required: true },
    ],
  },

  turnos: {
    resource: 'turno',
    title: 'Turnos',
    defaultSort: 'posicionTurno',
    service: createCatalogService<Turno>('turno'),
    columns: [
      { key: 'idTurno', header: 'ID', sortable: true },
      { key: 'idContratista', header: 'Contratista', sortable: true },
      { key: 'idOperacion', header: 'Operación', sortable: true },
      { key: 'posicionTurno', header: 'Posición' },
      { key: 'fechInicTurno', header: 'Fecha Inicio' },
      { key: 'fechFinTurno', header: 'Fecha Fin' },
      { key: 'estado', header: 'Estado' },
    ],
    fields: [
      { key: 'idContratista', label: 'ID Contratista', type: 'number', required: true },
      { key: 'idOperacion', label: 'ID Operación', type: 'number', required: true },
      { key: 'posicionTurno', label: 'Posición', type: 'text' },
      { key: 'fechInicTurno', label: 'Fecha Inicio', type: 'date' },
      { key: 'fechFinTurno', label: 'Fecha Fin', type: 'date' },
      { key: 'estado', label: 'Estado', type: 'text' },
    ],
  },

  tiposPago: {
    resource: 'tipopago',
    title: 'Tipos de Pago',
    defaultSort: 'descTipoPago',
    service: createCatalogService<TipoPago>('tipopago'),
    columns: [
      { key: 'idTipoPago', header: 'ID', sortable: true },
      { key: 'descTipoPago', header: 'Descripción', sortable: true },
      { key: 'observaciones', header: 'Observaciones' },
    ],
    fields: [
      { key: 'descTipoPago', label: 'Descripción', type: 'text', required: true },
      { key: 'observaciones', label: 'Observaciones', type: 'text' },
    ],
  },

  tiposOcurrencia: {
    resource: 'tipoocurrencia',
    title: 'Tipos de Ocurrencia',
    defaultSort: 'tipoOcurrenciaNombre',
    service: createCatalogService<TipoOcurrencia>('tipoocurrencia'),
    columns: [
      { key: 'idTipoOcurrencia', header: 'ID', sortable: true },
      { key: 'tipoOcurrenciaNombre', header: 'Nombre', sortable: true },
      { key: 'observaciones', header: 'Observaciones' },
    ],
    fields: [
      { key: 'tipoOcurrenciaNombre', label: 'Nombre', type: 'text', required: true },
      { key: 'observaciones', label: 'Observaciones', type: 'text' },
    ],
  },
};

export type CatalogKey = keyof typeof catalogConfigs;
