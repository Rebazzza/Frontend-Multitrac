import axios from 'axios';
import { applyJwtInterceptor } from '../interceptors/jwt.interceptor';
import { applyErrorInterceptor } from '../interceptors/error.interceptor';

const httpService = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

applyJwtInterceptor(httpService);
applyErrorInterceptor(httpService);

export default httpService;
