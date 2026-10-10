import httpService from './http.service';
import type { PersonalRecord } from '../../models/personal-record.model';

const BASE_PATH = '/PersonalRecord';

export const personalRecordService = {
  async getAll(): Promise<PersonalRecord[]> {
    const { data } = await httpService.get<PersonalRecord[]>(BASE_PATH);
    return data;
  },

  async create(dto: Partial<PersonalRecord>): Promise<PersonalRecord> {
    const { data } = await httpService.post<PersonalRecord>(BASE_PATH, dto);
    return data;
  },

  async update(id: number, dto: Partial<PersonalRecord>): Promise<void> {
    await httpService.put(`${BASE_PATH}/${id}`, dto);
  },

  async remove(id: number): Promise<void> {
    await httpService.delete(`${BASE_PATH}/${id}`);
  },
};
