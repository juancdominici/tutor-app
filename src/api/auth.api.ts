import { mpApi } from './mp.api';
import supabase from './supabase';

export interface LoginRequest {
  usuario: string;
  password: string;
}

export const login = async (loginPayload: LoginRequest) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: loginPayload.usuario,
    password: loginPayload.password,
  });
  if (error) {
    throw new Error(error.message);
  }
  return { data };
};

export const loginWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'http://localhost:3000',
    },
  });
  if (error) {
    throw new Error(error.message);
  }
  return { data };
};

export const register = async (payload: any) => {
  const { data, error } = await supabase.auth.signUp({
    email: payload.usuario,
    password: payload.password,
  });
  if (error) {
    throw new Error(error.message);
  }
  return { data };
};

export const passwordRecover = async (payload: any) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(payload.usuario, {
    redirectTo: 'http://localhost:3000',
  });
  if (error) {
    throw new Error(error.message);
  }
  return { data };
};

export const newTutor = async () => {
  const { data } = await supabase.auth.getSession();
  const { error } = await supabase.from('tutors').insert({
    id: data.session?.user?.id,
    notifications: false,
    status: true,
  });
  if (error) {
    throw new Error(error.message);
  }
};

export const newUser = async () => {
  const { data } = await supabase.auth.getSession();
  const { error } = await supabase.from('user_profiles').insert({
    id: data.session?.user?.id,
    notifications: false,
    status: true,
  });
  if (error) {
    throw new Error(error.message);
  }
};

export const checkUserExistance = async () => {
  try {
    const { data } = await supabase.auth.getSession();
    if (!data.session) return 'none';
    const userResult = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', data.session?.user?.id)
      .limit(1)
      .single();
    const tutorResult = await supabase.from('tutors').select('*').eq('id', data.session?.user?.id).limit(1).single();

    if (userResult.data) return 'user';
    if (tutorResult.data) return 'tutor';

    return 'fresh';
  } catch (error: any) {
    throw new Error(error.message);
  }
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
    .update({ mp_refresh_token: mpData?.refresh_token })
    .eq('id', data.session?.user?.id);

  localStorage.setItem('access_token', mpData?.access_token);
  localStorage.setItem('expires_in', mpData?.expires_in);
  localStorage.setItem('mp_refresh_token', mpData?.refresh_token);

  if (error) {
    throw new Error(error.message);
  }
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
};
