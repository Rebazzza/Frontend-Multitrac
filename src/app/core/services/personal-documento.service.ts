import httpService from './http.service';
import type {
  PersonalDocumentoDto,
  PersonalDocumentoFiltro,
  PersonalDocumentoListadoDto,
  CatalogoPersonalDocumento,
  CatalogoPersonalPersonal,
  CatalogoEstadoDocumento,
} from '../../models/personal-documento.model';

const BASE_PATH = '/PersonalDocumento';

export const personalDocumentoService = {
  async getAll(filtro: PersonalDocumentoFiltro = {}): Promise<PersonalDocumentoListadoDto[]> {
    const { data } = await httpService.get<PersonalDocumentoListadoDto[]>(BASE_PATH, {
      params: {
        idPersonal: filtro.idPersonal ?? undefined,
        idDocumento: filtro.idDocumento ?? undefined,
        estado: filtro.estado ?? undefined,
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

  async getCatalogoDocumentos(tipo?: string): Promise<CatalogoPersonalDocumento[]> {
    const { data } = await httpService.get<CatalogoPersonalDocumento[]>(`${BASE_PATH}/catalogos/documentos`, {
      params: { tipo: tipo ?? undefined },
    });
    return data;
  },

  async getCatalogoPersonales(): Promise<CatalogoPersonalPersonal[]> {
    const { data } = await httpService.get<CatalogoPersonalPersonal[]>(`${BASE_PATH}/catalogos/personales`);
    return data;
  },

  async getCatalogoEstados(): Promise<CatalogoEstadoDocumento[]> {
    const { data } = await httpService.get<CatalogoEstadoDocumento[]>(`${BASE_PATH}/catalogos/estados`);
    return data;
  },
};