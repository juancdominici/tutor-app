import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import supabase from './supabase';

export const mpApi = axios.create({
  baseURL: 'https://api.mercadopago.com/',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

export const getMercadoPagoAuthorization = async () => {
  const randomUuid = uuidv4();
  window.location.href = `https://auth.mercadopago.com.ar/authorization?client_id=${process.env.REACT_APP_MP_CLIENT_ID}&response_type=code&platform_id=mp&state=${randomUuid}&redirect_uri=${process.env.REACT_APP_MP_REDIRECT_URL}`;
};

export const createPreference = async (data: any) => {
  const { data: tutorData, error: tutorError } = await supabase
    .from('tutors')
    .select('mp_code, mp_refresh_token')
    .eq('id', data.tutor_id)
    .single();

  if (tutorError) {
    throw new Error(tutorError.message);
  }

  const refreshTokenResponse = await refreshAccessToken({
    tutor_id: data.tutor_id,
    code: tutorData?.mp_code,
    refreshToken: tutorData?.mp_refresh_token,
  });

  const { data: preferenceData } = await mpApi.post('/checkout/preferences', data.preference, {
    headers: {
      Authorization: `Bearer ${refreshTokenResponse.access_token}`,
      'Content-Type': 'application/json',
    },
  });
  return preferenceData;
};

export const refreshAccessToken = async (data: any) => {
  const { data: mpData } = await mpApi.post('oauth/token', {
    client_id: process.env.REACT_APP_MP_CLIENT_ID,
    client_secret: process.env.REACT_APP_MP_CLIENT_SECRET,
    grant_type: 'refresh_token',
    code: data.code,
    refresh_token: data.refreshToken,
  });

  const { error } = await supabase
    .from('tutors')
    .update({ mp_refresh_token: mpData?.refresh_token })
    .eq('id', data.tutor_id);

  if (error) {
    throw new Error(error.message);
  }

  return mpData;
};

export const saveMercadoPagoRefreshToken = async (code: string) => {
  const { data } = await supabase.auth.getSession();
  const { data: mpData } = await mpApi.post('oauth/token', {
    client_id: process.env.REACT_APP_MP_CLIENT_ID,
    client_secret: process.env.REACT_APP_MP_CLIENT_SECRET,
    grant_type: 'authorization_code',
    code,
    redirect_uri: process.env.REACT_APP_MP_REDIRECT_URL,
  });

  const { error } = await supabase
    .from('tutors')
    .update({ mp_refresh_token: mpData?.refresh_token, mp_code: code })
    .eq('id', data.session?.user?.id);

  if (error) {
    throw new Error(error.message);
  }
};
