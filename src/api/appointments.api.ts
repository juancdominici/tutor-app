import { APPOINTMENT_STATUS } from '@app/constants/constants';
import supabase from './supabase';

export const postRequest = async (payload: any) => {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    throw new Error(sessionError.message);
  }

  const { data, error } = await supabase
    .from('appointments')
    .insert({
      created: new Date(),
      date: payload.date,
      time: payload.time,
      status: payload.status,
      address_id: payload.address_id,
      tutor_service_id: payload.tutor_service_id,
      user_profile_id: sessionData?.session?.user?.id,
    })
    .select()
    .single();
  if (error) {
    throw new Error(error.message);
  }

  let detailsResponse = null;

  if (payload.details.length > 0) {
    const details = payload.details.map((detail: any) => {
      return {
        appointment_id: data?.id,
        detail: detail?.detail,
        quantity: detail?.quantity,
        additional_details: detail?.additional_details,
      };
    });

    const { data: detailsData, error: detailsError } = await supabase
      .from('appointment_details')
      .insert(details)
      .select();
    detailsResponse = detailsData;

    if (detailsError) {
      throw new Error(detailsError.message);
    }
  }

  return { data, detailsResponse };
};

export const getUserAppointments = async () => {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    throw new Error(sessionError.message);
  }

  const { data, error } = await supabase
    .from('appointments')
    .select(
      `
        *,
        tutor_services (
            *,
            tutors ( 
                id, 
                name, 
                bio, 
                description, 
                joindate, 
                notifications, 
                status
            )
        ),
        addresses (
            street,
            number,
            province,
            country,
            postcode
        ),
        appointment_details ( * ),
        user_profiles ( * )
        `,
    )
    .eq('user_profile_id', sessionData?.session?.user?.id);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getTutorAppointments = async () => {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    throw new Error(sessionError.message);
  }

  const { data, error } = await supabase
    .from('appointments')
    .select(
      `
        *,
        tutor_services (
            *,
            tutors (
                id, 
                name, 
                bio, 
                description, 
                joindate, 
                notifications, 
                status
            )
        ),
        addresses (
            street,
            number,
            province,
            country,
            postcode
        ),
        appointment_details ( * )
        `,
    )
    .neq('status', APPOINTMENT_STATUS.PENDING_APPROVAL)
    .eq('tutor_services.tutor_id', sessionData?.session?.user?.id);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getTutorRequests = async () => {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    throw new Error(sessionError.message);
  }

  const { data, error } = await supabase
    .from('appointments')
    .select(
      `
        *,
        tutor_services (
            *,
            tutors ( 
                id, 
                name, 
                bio, 
                description, 
                joindate, 
                notifications, 
                status
            )
        ),
        addresses (
            street,
            number,
            province,
            country,
            postcode
        ),
        appointment_details ( * )
        `,
    )
    .eq('status', APPOINTMENT_STATUS.PENDING_APPROVAL)
    .eq('tutor_services.tutor_id', sessionData?.session?.user?.id);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const changeAppointmentStatus = async (payload: any) => {
  const { data, error } = await supabase
    .from('appointments')
    .update({ status: payload.status })
    .eq('id', payload.id)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getAppointmentById = async (id: any) => {
  const { data, error } = await supabase
    .from('appointments')
    .select(
      `
            *,
            tutor_services (
                *,
                tutors ( 
                    id, 
                    name, 
                    bio, 
                    description, 
                    joindate, 
                    notifications, 
                    status
                )
            ),
            addresses (
                street,
                number,
                province,
                country,
                postcode
            ),
            appointment_details ( * )
            `,
    )
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
