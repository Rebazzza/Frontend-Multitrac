import httpService from './http.service';
import type { PersonalVacaciones } from '../../models/personal-vacaciones.model';

const BASE_PATH = '/PersonalVacaciones';

export const personalVacacionesService = {
  async getAll(): Promise<PersonalVacaciones[]> {
    const { data } = await httpService.get<PersonalVacaciones[]>(BASE_PATH);
    return data;
  },

  async create(dto: Partial<PersonalVacaciones>): Promise<PersonalVacaciones> {
    const { data } = await httpService.post<PersonalVacaciones>(BASE_PATH, dto);
    return data;
  },

  async update(id: number, dto: Partial<PersonalVacaciones>): Promise<void> {
    await httpService.put(`${BASE_PATH}/${id}`, dto);
  },

  async remove(id: number): Promise<void> {
    await httpService.delete(`${BASE_PATH}/${id}`);
  },
};
