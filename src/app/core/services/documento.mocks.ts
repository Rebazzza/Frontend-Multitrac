import type {
  DocumentoDto,
  DocumentoListadoDto,
  DocumentoPagedParams,
  DocumentoPendienteDto,
  DocumentoPendientesParams,
} from '../../models/documento.model';
import type { PagedResponse } from '../../models/paged-response.model';

/**
 * Datos mock del módulo Documentos. Existen solo porque el backend todavía no
 * expone los endpoints; `documento.service.ts` los usa mientras USAR_MOCKS=true.
 * El estado (altas, validaciones, rechazos) vive en memoria y se reinicia al
 * recargar la página.
 */

function fechaDesdeHoy(dias: number): string {
  const d = new Date();
  d.setDate(d.getDate() + dias);
  return d.toISOString().slice(0, 10);
}

function nivelDe(dias?: number | null): string {
  if (dias == null) return 'gris';
  if (dias <= 5) return 'rojo';
  if (dias <= 10) return 'naranja';
  if (dias <= 30) return 'amarillo';
  return 'verde';
}

function diasHasta(fecha?: string | null): number | null {
  if (!fecha) return null;
  const objetivo = new Date(fecha);
  if (Number.isNaN(objetivo.getTime())) return null;
  const hoy = new Date();
  const base = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()).getTime();
  return Math.round((objetivo.getTime() - base) / 86400000);
}

function estadoSegunVigencia(dias: number | null): DocumentoListadoDto['estado'] {
  if (dias == null) return 'SIN_VENCIMIENTO';
  if (dias < 0) return 'VENCIDO';
  if (dias <= 30) return 'POR_VENCER';
  return 'VIGENTE';
}

function paginar<T>(items: T[], page = 1, pageSize = 25): PagedResponse<T> {
  const totalCount = items.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const p = Math.min(Math.max(1, page), totalPages);
  const start = (p - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    totalCount,
    page: p,
    pageSize,
    totalPages,
    hasPrevious: p > 1,
    hasNext: p < totalPages,
  };
}

type Semilla = Omit<DocumentoListadoDto, 'fechaCaducidad' | 'nivelAlerta'>;

const SEMILLA_DOCUMENTOS: Semilla[] = [
  {
    idDocumentoRegistro: 1,
    tipoSujeto: 'EQUIPO',
    idSujeto: 1,
    codigoSujeto: 'BSG-816',
    nombreSujeto: 'Tracto Volvo FH16',
    idTipoDocumento: 1,
    nombreTipoDocumento: 'SOAT',
    nroDocumento: 'A-112233',
    fechaExpedicion: fechaDesdeHoy(-361),
    diasParaVencer: 4,
    estado: 'POR_VENCER',
    tieneArchivo: true,
    nombreArchivo: 'soat-bsg816.pdf',
  },
  {
    idDocumentoRegistro: 2,
    tipoSujeto: 'EQUIPO',
    idSujeto: 2,
    codigoSujeto: 'M2Q-703',
    nombreSujeto: 'Carreta de plataforma',
    idTipoDocumento: 2,
    nombreTipoDocumento: 'Revisión Técnica',
    nroDocumento: 'RT-556677',
    fechaExpedicion: fechaDesdeHoy(-356),
    diasParaVencer: 9,
    estado: 'POR_VENCER',
    tieneArchivo: true,
    nombreArchivo: 'revision-tecnica-m2q703.jpg',
  },
  {
    idDocumentoRegistro: 3,
    tipoSujeto: 'EQUIPO',
    idSujeto: 3,
    codigoSujeto: 'T0N-847',
    nombreSujeto: 'Tracto Scania R450',
    idTipoDocumento: 3,
    nombreTipoDocumento: 'Tarjeta de Propiedad',
    nroDocumento: 'TP-998811',
    fechaExpedicion: fechaDesdeHoy(-900),
    diasParaVencer: null,
    estado: 'SIN_VENCIMIENTO',
    tieneArchivo: true,
    nombreArchivo: 'tarjeta-propiedad-t0n847.jpg',
  },
  {
    idDocumentoRegistro: 4,
    tipoSujeto: 'EQUIPO',
    idSujeto: 1,
    codigoSujeto: 'BSG-816',
    nombreSujeto: 'Tracto Volvo FH16',
    idTipoDocumento: 4,
    nombreTipoDocumento: 'Permiso de Operaciones',
    nroDocumento: 'PO-2026-014',
    fechaExpedicion: fechaDesdeHoy(-340),
    kilometraje: 185000,
    diasParaVencer: 25,
    estado: 'VIGENTE',
    tieneArchivo: true,
    nombreArchivo: 'permiso-operaciones-bsg816.pdf',
  },
  {
    idDocumentoRegistro: 5,
    tipoSujeto: 'PERSONAL',
    idSujeto: 1,
    codigoSujeto: 'DNI 45678912',
    nombreSujeto: 'AYALA QUISPE, JUAN',
    idTipoDocumento: 5,
    nombreTipoDocumento: 'DNI',
    nroDocumento: '45678912',
    fechaExpedicion: fechaDesdeHoy(-1200),
    diasParaVencer: null,
    estado: 'SIN_VENCIMIENTO',
    tieneArchivo: false,
    nombreArchivo: null,
  },
  {
    idDocumentoRegistro: 6,
    tipoSujeto: 'PERSONAL',
    idSujeto: 1,
    codigoSujeto: 'DNI 45678912',
    nombreSujeto: 'AYALA QUISPE, JUAN',
    idTipoDocumento: 6,
    nombreTipoDocumento: 'Licencia de Conducir',
    nroDocumento: 'Q45678912',
    fechaExpedicion: fechaDesdeHoy(-700),
    diasParaVencer: 120,
    estado: 'VIGENTE',
    tieneArchivo: true,
    nombreArchivo: 'licencia-ayala.jpg',
  },
  {
    idDocumentoRegistro: 7,
    tipoSujeto: 'PERSONAL',
    idSujeto: 1,
    codigoSujeto: 'DNI 45678912',
    nombreSujeto: 'AYALA QUISPE, JUAN',
    idTipoDocumento: 7,
    nombreTipoDocumento: 'Examen Médico',
    nroDocumento: 'EM-2025-3321',
    fechaExpedicion: fechaDesdeHoy(-368),
    diasParaVencer: -3,
    estado: 'VENCIDO',
    tieneArchivo: true,
    nombreArchivo: 'examen-medico-ayala.pdf',
  },
  {
    idDocumentoRegistro: 8,
    tipoSujeto: 'PERSONAL',
    idSujeto: 2,
    codigoSujeto: 'DNI 41234567',
    nombreSujeto: 'TORRES MENDOZA, LUIS',
    idTipoDocumento: 7,
    nombreTipoDocumento: 'Examen Médico',
    nroDocumento: 'EM-2026-0044',
    fechaExpedicion: fechaDesdeHoy(-300),
    diasParaVencer: 60,
    estado: 'VIGENTE',
    tieneArchivo: true,
    nombreArchivo: 'examen-medico-torres.pdf',
  },
  {
    idDocumentoRegistro: 9,
    tipoSujeto: 'CONTRATISTA',
    idSujeto: 1,
    codigoSujeto: 'RUC 20481234567',
    nombreSujeto: 'TRANSPORTES ANDINOS SAC',
    idTipoDocumento: 9,
    nombreTipoDocumento: 'RUC',
    nroDocumento: '20481234567',
    fechaExpedicion: fechaDesdeHoy(-1500),
    diasParaVencer: null,
    estado: 'SIN_VENCIMIENTO',
    tieneArchivo: false,
    nombreArchivo: null,
  },
  {
    idDocumentoRegistro: 10,
    tipoSujeto: 'CONTRATISTA',
    idSujeto: 1,
    codigoSujeto: 'RUC 20481234567',
    nombreSujeto: 'TRANSPORTES ANDINOS SAC',
    idTipoDocumento: 11,
    nombreTipoDocumento: 'SCTR',
    nroDocumento: 'SCTR-2026-889',
    fechaExpedicion: fechaDesdeHoy(-350),
    diasParaVencer: 14,
    estado: 'VIGENTE',
    tieneArchivo: true,
    nombreArchivo: 'sctr-andinos.pdf',
  },
  {
    idDocumentoRegistro: 11,
    tipoSujeto: 'CONTRATISTA',
    idSujeto: 2,
    codigoSujeto: 'RUC 20599887766',
    nombreSujeto: 'SERVICIOS LOGISTICOS DEL SUR EIRL',
    idTipoDocumento: 10,
    nombreTipoDocumento: 'Contrato de Servicio',
    nroDocumento: 'CS-2026-007',
    fechaExpedicion: fechaDesdeHoy(-160),
    diasParaVencer: 200,
    estado: 'VIGENTE',
    tieneArchivo: true,
    nombreArchivo: 'contrato-logistica.pdf',
  },
  {
    idDocumentoRegistro: 12,
    tipoSujeto: 'CONTRATISTA',
    idSujeto: 2,
    codigoSujeto: 'RUC 20599887766',
    nombreSujeto: 'SERVICIOS LOGISTICOS DEL SUR EIRL',
    idTipoDocumento: 12,
    nombreTipoDocumento: 'Certificado de Homologación',
    nroDocumento: 'CH-2026-051',
    fechaExpedicion: fechaDesdeHoy(-359),
    kilometraje: 98500,
    diasParaVencer: 6,
    estado: 'POR_VENCER',
    tieneArchivo: true,
    nombreArchivo: 'homologacion-sur.jpg',
  },
];

let documentos: DocumentoListadoDto[] = SEMILLA_DOCUMENTOS.map((s) => ({
  ...s,
  fechaCaducidad: s.diasParaVencer == null ? null : fechaDesdeHoy(s.diasParaVencer),
  nivelAlerta: nivelDe(s.diasParaVencer ?? null),
}));

let pendientes: DocumentoPendienteDto[] = [
  {
    idSolicitud: 3001,
    idDocumentoRegistro: 7,
    tipoSujeto: 'PERSONAL',
    codigoSujeto: 'DNI 45678912',
    nombreSujeto: 'AYALA QUISPE, JUAN',
    nombreTipoDocumento: 'Examen Médico',
    nroDocumento: 'EM-2025-3321',
    solicitante: 'RRHH - M. Salazar',
    fechaSolicitud: fechaDesdeHoy(-2),
    estado: 'PENDIENTE',
    observacion: 'Adjunta resultado de laboratorio.',
    tieneArchivo: true,
    nombreArchivo: 'examen-medico-ayala.pdf',
  },
  {
    idSolicitud: 3002,
    idDocumentoRegistro: 10,
    tipoSujeto: 'CONTRATISTA',
    codigoSujeto: 'RUC 20481234567',
    nombreSujeto: 'TRANSPORTES ANDINOS SAC',
    nombreTipoDocumento: 'SCTR',
    nroDocumento: 'SCTR-2026-889',
    solicitante: 'Operaciones - J. Paredes',
    fechaSolicitud: fechaDesdeHoy(-1),
    estado: 'PENDIENTE',
    observacion: null,
    tieneArchivo: true,
    nombreArchivo: 'sctr-andinos.pdf',
  },
  {
    idSolicitud: 3003,
    idDocumentoRegistro: 2,
    tipoSujeto: 'EQUIPO',
    codigoSujeto: 'M2Q-703',
    nombreSujeto: 'Carreta de plataforma',
    nombreTipoDocumento: 'Revisión Técnica',
    nroDocumento: 'RT-556677',
    solicitante: 'Flota - K. Ramírez',
    fechaSolicitud: fechaDesdeHoy(-4),
    estado: 'PENDIENTE',
    observacion: null,
    tieneArchivo: true,
    nombreArchivo: 'revision-tecnica-m2q703.jpg',
  },
  {
    idSolicitud: 3004,
    idDocumentoRegistro: 4,
    tipoSujeto: 'EQUIPO',
    codigoSujeto: 'BSG-816',
    nombreSujeto: 'Tracto Volvo FH16',
    nombreTipoDocumento: 'Permiso de Operaciones',
    nroDocumento: 'PO-2026-014',
    solicitante: 'Flota - K. Ramírez',
    fechaSolicitud: fechaDesdeHoy(-6),
    estado: 'PENDIENTE',
    observacion: 'Falta firma del representante.',
    tieneArchivo: true,
    nombreArchivo: 'permiso-operaciones-bsg816.pdf',
  },
  {
    idSolicitud: 3005,
    idDocumentoRegistro: 12,
    tipoSujeto: 'CONTRATISTA',
    codigoSujeto: 'RUC 20599887766',
    nombreSujeto: 'SERVICIOS LOGISTICOS DEL SUR EIRL',
    nombreTipoDocumento: 'Certificado de Homologación',
    nroDocumento: 'CH-2026-051',
    solicitante: 'Seguridad - P. Chávez',
    fechaSolicitud: fechaDesdeHoy(-8),
    estado: 'PENDIENTE',
    observacion: null,
    tieneArchivo: true,
    nombreArchivo: 'homologacion-sur.jpg',
  },
  {
    idSolicitud: 3006,
    idDocumentoRegistro: 8,
    tipoSujeto: 'PERSONAL',
    codigoSujeto: 'DNI 41234567',
    nombreSujeto: 'TORRES MENDOZA, LUIS',
    nombreTipoDocumento: 'Examen Médico',
    nroDocumento: 'EM-2026-0044',
    solicitante: 'RRHH - M. Salazar',
    fechaSolicitud: fechaDesdeHoy(-12),
    estado: 'APROBADO',
    observacion: null,
    tieneArchivo: true,
    nombreArchivo: 'examen-medico-torres.pdf',
  },
];

let secuenciaDocumento = 1000;

function pdfDemo(): Blob {
  const contenido = [
    '%PDF-1.4',
    '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj',
    '2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj',
    '3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 320 200] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj',
    '4 0 obj << /Length 62 >> stream',
    'BT /F1 16 Tf 24 110 Td (Documento de demostracion) Tj ET',
    'endstream endobj',
    '5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj',
    'trailer << /Root 1 0 R >>',
    '%%EOF',
  ].join('\n');
  return new Blob([contenido], { type: 'application/pdf' });
}

function imagenDemo(titulo: string): Blob {
  const svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="900" height="560" viewBox="0 0 900 560">',
    '<rect width="900" height="560" fill="#0b1220"/>',
    '<rect x="40" y="40" width="820" height="480" rx="16" fill="#111c33" stroke="#1f2f4d"/>',
    `<text x="80" y="150" fill="#e2e8f0" font-family="Segoe UI, sans-serif" font-size="34" font-weight="600">${titulo}</text>`,
    '<text x="80" y="215" fill="#94a3b8" font-family="Segoe UI, sans-serif" font-size="20">Vista previa de demostración</text>',
    '<text x="80" y="265" fill="#64748b" font-family="Segoe UI, sans-serif" font-size="18">El archivo real lo servirá el backend de forma segura.</text>',
    '<line x1="80" y1="320" x2="820" y2="320" stroke="#1f2f4d" stroke-width="2"/>',
    '<text x="80" y="370" fill="#475569" font-family="Segoe UI, sans-serif" font-size="16">Documento generado por el modo mock</text>',
    '</svg>',
  ].join('');
  return new Blob([svg], { type: 'image/svg+xml' });
}

export const documentoMocks = {
  async getPaged(params: DocumentoPagedParams = {}): Promise<PagedResponse<DocumentoListadoDto>> {
    const term = (params.search ?? '').trim().toLowerCase();
    const filtrados = documentos.filter((d) => {
      if (params.tipoSujeto && d.tipoSujeto !== params.tipoSujeto) return false;
      if (params.idTipoDocumento && d.idTipoDocumento !== params.idTipoDocumento) return false;
      if (params.estado && d.estado !== params.estado) return false;
      if (!term) return true;
      return [d.codigoSujeto, d.nombreSujeto, d.nombreTipoDocumento, d.nroDocumento, String(d.idDocumentoRegistro)]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(term));
    });
    return paginar(filtrados, params.page ?? 1, params.pageSize ?? 25);
  },

  async getById(id: number): Promise<DocumentoDto> {
    const item = documentos.find((d) => d.idDocumentoRegistro === id);
    if (!item) throw { status: 404, message: 'Documento no encontrado.' };
    return {
      idDocumentoRegistro: item.idDocumentoRegistro,
      tipoSujeto: item.tipoSujeto,
      idSujeto: item.idSujeto ?? null,
      idTipoDocumento: item.idTipoDocumento,
      nroDocumento: item.nroDocumento ?? null,
      fechaExpedicion: item.fechaExpedicion ?? null,
      fechaCaducidad: item.fechaCaducidad ?? null,
      kilometraje: item.kilometraje ?? null,
      observacion: null,
      tieneArchivo: item.tieneArchivo,
      nombreArchivo: item.nombreArchivo ?? null,
    };
  },

  async create(dto: DocumentoDto): Promise<DocumentoDto> {
    secuenciaDocumento += 1;
    const id = secuenciaDocumento;
    const dias = diasHasta(dto.fechaCaducidad);
    documentos = [
      {
        idDocumentoRegistro: id,
        tipoSujeto: dto.tipoSujeto,
        idSujeto: dto.idSujeto ?? null,
        codigoSujeto: 'NUEVO',
        nombreSujeto: null,
        idTipoDocumento: dto.idTipoDocumento ?? 0,
        nombreTipoDocumento: null,
        nroDocumento: dto.nroDocumento ?? null,
        fechaExpedicion: dto.fechaExpedicion ?? null,
        fechaCaducidad: dto.fechaCaducidad ?? null,
        kilometraje: dto.kilometraje ?? null,
        estado: estadoSegunVigencia(dias),
        diasParaVencer: dias,
        nivelAlerta: nivelDe(dias),
        tieneArchivo: false,
        nombreArchivo: null,
      },
      ...documentos,
    ];
    return { ...dto, idDocumentoRegistro: id };
  },

  async update(id: number, dto: DocumentoDto): Promise<void> {
    const dias = diasHasta(dto.fechaCaducidad);
    documentos = documentos.map((d) =>
      d.idDocumentoRegistro === id
        ? {
            ...d,
            nroDocumento: dto.nroDocumento ?? null,
            fechaExpedicion: dto.fechaExpedicion ?? null,
            fechaCaducidad: dto.fechaCaducidad ?? null,
            kilometraje: dto.kilometraje ?? null,
            estado: estadoSegunVigencia(dias),
            diasParaVencer: dias,
            nivelAlerta: nivelDe(dias),
          }
        : d,
    );
  },

  async remove(id: number): Promise<void> {
    documentos = documentos.filter((d) => d.idDocumentoRegistro !== id);
  },

  async getPendientes(
    params: DocumentoPendientesParams = {},
  ): Promise<PagedResponse<DocumentoPendienteDto>> {
    const term = (params.search ?? '').trim().toLowerCase();
    const filtrados = pendientes.filter((p) => {
      if (params.tipoSujeto && p.tipoSujeto !== params.tipoSujeto) return false;
      if (params.estado && p.estado !== params.estado) return false;
      if (!term) return true;
      return [p.codigoSujeto, p.nombreSujeto, p.nombreTipoDocumento, p.nroDocumento, p.solicitante]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(term));
    });
    return paginar(filtrados, params.page ?? 1, params.pageSize ?? 25);
  },

  async resolver(ids: number[], aprobar: boolean, observacion?: string | null): Promise<void> {
    const destino = aprobar ? 'APROBADO' : 'RECHAZADO';
    pendientes = pendientes.map((p) =>
      ids.includes(p.idSolicitud)
        ? { ...p, estado: destino, observacion: observacion ?? p.observacion ?? null }
        : p,
    );
  },

  async getArchivo(id: number): Promise<{ blob: Blob; contentType: string }> {
    const item = documentos.find((d) => d.idDocumentoRegistro === id);
    const nombre = item?.nombreArchivo ?? '';
    if (/\.pdf$/i.test(nombre)) {
      return { blob: pdfDemo(), contentType: 'application/pdf' };
    }
    return { blob: imagenDemo(nombre || `Documento ${id}`), contentType: 'image/svg+xml' };
  },
};
