import { mpApi } from './mp.api';
import supabase from './supabase';

export interface LoginRequest {
  usuario: string;
  password: string;
}

export const getSessionData = async () => {
  const { data } = await supabase.auth.getSession();
  return data;
};

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
      redirectTo: window.location.origin,
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
    redirectTo: window.location.origin,
  });
  if (error) {
    throw new Error(error.message);
  }
  return { data };
};

export const changeUserPassword = async (payload: any) => {
  const { data, error } = await supabase.auth.updateUser({ password: payload.password });
  if (error) {
    throw new Error(error.message);
  }
  return { data };
};

export const newTutor = async (payload: any) => {
  const { data } = await supabase.auth.getSession();
  const { error } = await supabase.from('tutors').insert({
    id: data.session?.user?.id,
    ...payload,
    notifications: false,
    status: true,
  });
  if (error) {
    throw new Error(error.message);
  }
};

export const newUser = async (payload: any) => {
  const { data } = await supabase.auth.getSession();
  const { error } = await supabase.from('user_profiles').insert({
    id: data.session?.user?.id,
    ...payload,
    notifications: false,
    status: true,
  });
  if (error) {
    throw new Error(error.message);
  }
};

export const getUserData = async () => {
  const { data } = await supabase.auth.getSession();
  const { data: userData } = await supabase.from('user_profiles').select('*').eq('id', data.session?.user?.id).limit(1);
  const { data: tutorData } = await supabase.from('tutors').select('*').eq('id', data.session?.user?.id).limit(1);
  if (userData && userData[0]) return { userMetadata: data, userData: userData[0] };
  if (tutorData && tutorData[0]) return { userMetadata: data, userData: tutorData[0] };
};

export const checkUserExistance = async () => {
  try {
    const { data } = await supabase.auth.getSession();
    if (!data.session) return 'none';
    const adminResult = await supabase.from('administrators').select('*').eq('id', data.session?.user?.id).limit(1);
    const userResult = await supabase.from('user_profiles').select('*').eq('id', data.session?.user?.id).limit(1);
    const tutorResult = await supabase.from('tutors').select('*').eq('id', data.session?.user?.id).limit(1);

    if (adminResult.data && adminResult.data[0]) return 'admin';
    if (userResult.data && userResult.data[0]) return 'user';
    if (tutorResult.data && tutorResult.data[0]) return 'tutor';

    return 'fresh';
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const checkMPTokenValidity = async () => {
  try {
    const { data } = await supabase.auth.getSession();
    const { data: tutorData } = await supabase.from('tutors').select('*').eq('id', data.session?.user?.id).limit(1);
    if (tutorData && tutorData[0]) {
      return !!tutorData[0].mp_refresh_token && !!tutorData[0].mp_code;
    }
    return false;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getTutorProfileData = async (userId: any): Promise<any> => {
  try {
    const { data: tutorProfileData } = await supabase.rpc('get_tutor_profile_data', { user_id: userId });

    return tutorProfileData[0] ?? null;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
};
