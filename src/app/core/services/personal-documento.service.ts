import httpService from './http.service';
import type { ApiError } from '../interceptors/error.interceptor';
import type { PagedResponse } from '../../models/paged-response.model';
import type {
  PersonalDocumentoDto,
  PersonalDocumentoFiltro,
  PersonalDocumentoListadoDto,
  CatalogoPersonalDocumento,
  CatalogoPersonalPersonal,
  CatalogoEstadoDocumento,
} from '../../models/personal-documento.model';

const BASE_PATH = '/PersonalDocumento';

/** Parametros del listado paginado de documentos de personal. */
export interface PersonalDocumentoPagedParams {
  page?: number;
  pageSize?: number;
  search?: string;
  idPersonal?: number;
  idDocumento?: number;
  estado?: string;
}

/** Garantiza que la respuesta sea siempre un arreglo, aunque la API devuelva null/objeto. */
function asLista<T>(data: unknown): T[] {
  return Array.isArray(data) ? (data as T[]) : [];
}

export interface CatalogosPersonalDocumento {
  documentos: CatalogoPersonalDocumento[];
  personales: CatalogoPersonalPersonal[];
  estados: CatalogoEstadoDocumento[];
  /** true cuando al menos un catálogo falló; los catálogos fallidos se devuelven vacíos. */
  parcial: boolean;
  /** Mensaje controlado listo para mostrar al usuario ('' si todo cargó correctamente). */
  mensaje: string;
}

async function getCatalogoDocumentos(tipo?: string): Promise<CatalogoPersonalDocumento[]> {
  const { data } = await httpService.get<CatalogoPersonalDocumento[]>(`${BASE_PATH}/catalogos/documentos`, {
    params: { tipo: tipo ?? undefined },
  });
  return asLista<CatalogoPersonalDocumento>(data);
}

async function getCatalogoPersonales(): Promise<CatalogoPersonalPersonal[]> {
  const { data } = await httpService.get<CatalogoPersonalPersonal[]>(`${BASE_PATH}/catalogos/personales`);
  return asLista<CatalogoPersonalPersonal>(data);
}

async function getCatalogoEstados(): Promise<CatalogoEstadoDocumento[]> {
  const { data } = await httpService.get<CatalogoEstadoDocumento[]>(`${BASE_PATH}/catalogos/estados`);
  return asLista<CatalogoEstadoDocumento>(data);
}

export const personalDocumentoService = {
  async getAll(filtro: PersonalDocumentoFiltro = {}): Promise<PersonalDocumentoListadoDto[]> {
    const { data } = await httpService.get<PersonalDocumentoListadoDto[]>(BASE_PATH, {
      params: {
        idPersonal: filtro.idPersonal ?? undefined,
        idDocumento: filtro.idDocumento ?? undefined,
        estado: filtro.estado ?? undefined,
      },
    });
    return asLista<PersonalDocumentoListadoDto>(data);
  },

  /**
   * Listado paginado resuelto en el servidor. Evita descargar toda la tabla y
   * filtrar en el navegador (causa de la demora con volumen alto).
   */
  async getPaged(params: PersonalDocumentoPagedParams = {}): Promise<PagedResponse<PersonalDocumentoListadoDto>> {
    const { data } = await httpService.get<PagedResponse<PersonalDocumentoListadoDto>>(`${BASE_PATH}/paged`, {
      params: {
        page: params.page ?? 1,
        pageSize: params.pageSize ?? 25,
        search: params.search?.trim() || undefined,
        idPersonal: params.idPersonal ?? undefined,
        idDocumento: params.idDocumento ?? undefined,
        estado: params.estado || undefined,
      },
    });
    return data;
  },

  async getById(id: number): Promise<PersonalDocumentoDto> {
    const { data } = await httpService.get<PersonalDocumentoDto>(`${BASE_PATH}/${id}`);
    return data;
  },

  async create(dto: PersonalDocumentoDto): Promise<PersonalDocumentoListadoDto> {
    const { data } = await httpService.post<PersonalDocumentoListadoDto>(BASE_PATH, dto);
    return data;
  },

  async update(id: number, dto: PersonalDocumentoDto): Promise<void> {
    await httpService.put(`${BASE_PATH}/${id}`, dto);
  },

  async remove(id: number): Promise<void> {
    await httpService.delete(`${BASE_PATH}/${id}`);
  },

  getCatalogoDocumentos,
  getCatalogoPersonales,
  getCatalogoEstados,

  /**
   * Carga los catálogos en paralelo de forma resiliente. Usa `Promise.allSettled`
   * para que el fallo de un catálogo no cancele ni dispare en cadena los demás.
   * Nunca rechaza: devuelve los catálogos disponibles, marca `parcial` y entrega
   * un `mensaje` controlado para la UI.
   */
  async getCatalogos(): Promise<CatalogosPersonalDocumento> {
    try {
      const [docs, pers, est] = await Promise.allSettled([
        getCatalogoDocumentos(),
        getCatalogoPersonales(),
        getCatalogoEstados(),
      ]);

      const unwrap = <T>(resultado: PromiseSettledResult<T[]>): T[] =>
        resultado.status === 'fulfilled' ? resultado.value : [];

      const fallidos: string[] = [];
      if (docs.status === 'rejected') fallidos.push('documentos');
      if (pers.status === 'rejected') fallidos.push('personal');
      if (est.status === 'rejected') fallidos.push('estados');

      const parcial = fallidos.length > 0;
      const mensaje = parcial
        ? `No se pudieron cargar algunos catálogos (${fallidos.join(', ')}). Los filtros pueden estar incompletos.`
        : '';

      if (parcial) {
        console.warn(`[PersonalDocumento] ${mensaje}`);
      }

      return {
        documentos: unwrap(docs),
        personales: unwrap(pers),
        estados: unwrap(est),
        parcial,
        mensaje,
      };
    } catch (err) {
      const apiError = err as ApiError;
      const mensaje = apiError?.message || 'No se pudieron cargar los catálogos.';
      console.warn(`[PersonalDocumento] ${mensaje}`);
      return { documentos: [], personales: [], estados: [], parcial: true, mensaje };
    }
  },
};
