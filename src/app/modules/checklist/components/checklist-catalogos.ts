import type {
  ChecklistArea,
  ChecklistEstado,
  ChecklistTipo,
} from '../../../models/checklist.model';

/**
 * Catalogos copiados de BDMultitrac. El backend no expone endpoints de solo lectura
 * para estas tres tablas, asi que viven aqui. Si se agregan filas en la BD hay que
 * actualizar este archivo a mano.
 *
 * Ojo con los ids: CHECKLIST_TIPO.IdAreaMultitrac NO referencia la tabla AREA (6/9)
 * sino CHECKLIST_AREA.IdChecklistArea (1 = MANTENIMIENTO, 2 = SEGURIDAD Y PDP).
 * Ademas el id de tipo no es correlativo por area: area 1 usa 6/8/9 y area 2 usa 1..5/7/10.
 *
 * La fila 0 de cada catalogo ("Seleccione...") se omite a proposito.
 */

export const CHECKLIST_AREAS: ChecklistArea[] = [
  { idChecklistArea: 1, idAreaMultitrac: 6, nombreArea: 'MANTENIMIENTO' },
  { idChecklistArea: 2, idAreaMultitrac: 9, nombreArea: 'SEGURIDAD Y PDP' },
];

export const CHECKLIST_TIPOS: ChecklistTipo[] = [
  // Area 1 - MANTENIMIENTO
  { idCheckListTipo: 6, idAreaMultitrac: 1, nombreTipo: 'CONTROL DE CALIDAD - MANTENIMIENTO' },
  {
    idCheckListTipo: 8,
    idAreaMultitrac: 1,
    nombreTipo: 'INSPECCIÓN DE QUINTA RUEDA, KING PIN Y PLANCHA',
  },
  { idCheckListTipo: 9, idAreaMultitrac: 1, nombreTipo: 'CONTROL DE NEUMATICOS' },
  // Area 2 - SEGURIDAD Y PDP
  { idCheckListTipo: 1, idAreaMultitrac: 2, nombreTipo: 'CHECKLIST DOCUMENTOS' },
  {
    idCheckListTipo: 2,
    idAreaMultitrac: 2,
    nombreTipo: 'CHECKLIST DE TRANSPORTE DE CARGA SECA : RANSA - MAERSK',
  },
  { idCheckListTipo: 3, idAreaMultitrac: 2, nombreTipo: 'CHECKLIST DE TRACTO | CISTERNA DE EMULSION' },
  { idCheckListTipo: 4, idAreaMultitrac: 2, nombreTipo: 'CHECKLIST DE TRACTO | ACOPLE' },
  { idCheckListTipo: 5, idAreaMultitrac: 2, nombreTipo: 'CHECKLIST DE TRACTO | BOMBONA' },
  { idCheckListTipo: 7, idAreaMultitrac: 2, nombreTipo: 'INSPECCION INTERNA DE SEGURIDAD - MULTITRAC' },
  {
    idCheckListTipo: 10,
    idAreaMultitrac: 2,
    nombreTipo: 'CHECKLIST PARA DESCARGA DE BOMBONA CON CAL FINA',
  },
];

export const CHECKLIST_ESTADOS: ChecklistEstado[] = [
  { idEstadoCheckList: 1, estadoCheckList: 'OPERATIVO' },
  { idEstadoCheckList: 2, estadoCheckList: 'INOPERATIVO' },
  { idEstadoCheckList: 3, estadoCheckList: 'OBSEVADO' },
];
