import httpService from './http.service';
import type { DashboardResumen } from '../../models/dashboard.model';

export const dashboardService = {
  async getResumen(): Promise<DashboardResumen> {
    const { data } = await httpService.get<DashboardResumen>('/dashboard/resumen');
    return data;
  },
};