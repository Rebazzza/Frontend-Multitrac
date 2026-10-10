import httpService from './http.service';
import type { PersonalLicenciaConducir } from '../../models/personal-licencia.model';

const BASE_PATH = '/PersonalLicenciaConducir';

export const personalLicenciaService = {
  async getAll(): Promise<PersonalLicenciaConducir[]> {
    const { data } = await httpService.get<PersonalLicenciaConducir[]>(BASE_PATH);
    return data;
  },

  async create(dto: Partial<PersonalLicenciaConducir>): Promise<PersonalLicenciaConducir> {
    const { data } = await httpService.post<PersonalLicenciaConducir>(BASE_PATH, dto);
    return data;
  },

  async update(id: number, dto: Partial<PersonalLicenciaConducir>): Promise<void> {
    await httpService.put(`${BASE_PATH}/${id}`, dto);
  },

  async remove(id: number): Promise<void> {
    await httpService.delete(`${BASE_PATH}/${id}`);
  },
};
