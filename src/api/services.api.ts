import { APPOINTMENT_STATUS } from '@app/constants/constants';
import supabase from './supabase';

export const getServiceUseStatus = async (service: any) => {
  const { data, error } = await supabase
    .from('tutor_services')
    .select('*, appointments!inner(*)')
    .eq('id', service.id)
    .neq('appointments.status', APPOINTMENT_STATUS.PENDING_APPROVAL)
    .neq('appointments.status', APPOINTMENT_STATUS.COMPLETE)
    .neq('appointments.status', APPOINTMENT_STATUS.REJECTED)
    .eq('status', true);

  if (error) {
    throw new Error(error.message);
  }

  // If user users have appointments with this service, return true
  if (data && data?.length > 0) {
    throw new Error('El servicio ya está en uso.');
  }
};

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
  const { data: sessionData } = await supabase.auth.getSession();
  const { error } = await supabase
    .from('tutor_services')
    .insert({ ...service, tutor_id: sessionData?.session?.user?.id })
    .single();

  if (error) {
    throw new Error(error.message);
  }
};

export const putService = async (service: any) => {
  await getServiceUseStatus(service);

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

export const deleteService = async (service: any) => {
  await getServiceUseStatus(service);

  const { data, error } = await supabase.from('tutor_services').update({ status: false }).eq('id', service.id);

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
