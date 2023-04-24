import { checkUserExistance } from './auth.api';
import supabase from './supabase';

export const getUserServices = async () => {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  const { data, error } = await supabase
    .from('tutor_services')
    .select('*')
    .eq('status', true)
    .eq('tutor_id', sessionData?.session?.user?.id);

  if (error) {
    throw new Error(error.message);
  }
  if (sessionError) {
    throw new Error(sessionError.message);
  }
  return data;
};

export const postService = async (service: any) => {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  const { error } = await supabase
    .from('tutor_services')
    .insert({ ...service, tutor_id: sessionData?.session?.user?.id })
    .single();

  if (error) {
    throw new Error(error.message);
  }
};

export const putService = async (service: any) => {
  const { error } = await supabase
    .from('tutor_services')
    .update({ ...service })
    .eq('id', service.id)
    .single();

  if (error) {
    throw new Error(error.message);
  }
};

export const getService = async (id: any) => {
  const { data, error } = (await supabase.from('tutor_services').select('*').eq('id', id).eq('status', true)) as any;

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const deleteService = async (id: any) => {
  const { data, error } = await supabase.from('tutor_services').delete().eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const getTutorServices = async (tutorId: any) => {
  const { data, error } = await supabase.from('services').select('*').eq('tutor_id', tutorId).eq('status', true);

  if (error) {
    throw new Error(error.message);
  }
  return data;
};
