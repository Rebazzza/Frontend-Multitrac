import httpService from './http.service';
import type { PersonalEpp, PersonalEppKardex } from '../../models/personal-epp.model';

const EPP_PATH = '/PersonalEpp';
const KARDEX_PATH = '/PersonalEppKardex';

export const personalEppService = {
  async getAll(): Promise<PersonalEpp[]> {
    const { data } = await httpService.get<PersonalEpp[]>(EPP_PATH);
    return data;
  },

  async create(dto: Partial<PersonalEpp>): Promise<PersonalEpp> {
    const { data } = await httpService.post<PersonalEpp>(EPP_PATH, dto);
    return data;
  },

  async update(id: number, dto: Partial<PersonalEpp>): Promise<void> {
    await httpService.put(`${EPP_PATH}/${id}`, dto);
  },

  async remove(id: number): Promise<void> {
    await httpService.delete(`${EPP_PATH}/${id}`);
  },
};

export const personalEppKardexService = {
  async getAll(): Promise<PersonalEppKardex[]> {
    const { data } = await httpService.get<PersonalEppKardex[]>(KARDEX_PATH);
    return data;
  },

  async create(dto: Partial<PersonalEppKardex>): Promise<PersonalEppKardex> {
    const { data } = await httpService.post<PersonalEppKardex>(KARDEX_PATH, dto);
    return data;
  },

  async update(id: number, dto: Partial<PersonalEppKardex>): Promise<void> {
    await httpService.put(`${KARDEX_PATH}/${id}`, dto);
  },

  async remove(id: number): Promise<void> {
    await httpService.delete(`${KARDEX_PATH}/${id}`);
  },
};
