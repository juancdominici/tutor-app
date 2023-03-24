import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export const mpApi = axios.create({
  baseURL: 'https://api.mercadopago.com/',
});

export const getMercadoPagoAuthorization = async () => {
  const randomUuid = uuidv4();
  window.location.href = `https://auth.mercadopago.com.ar/authorization?client_id=${process.env.REACT_APP_MP_CLIENT_ID}&response_type=code&platform_id=mp&state=${randomUuid}&redirect_uri=${process.env.REACT_APP_MP_REDIRECT_URL}`;
};
