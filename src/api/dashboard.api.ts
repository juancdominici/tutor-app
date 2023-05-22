import { APPOINTMENT_STATUS } from '@app/constants/constants';
import supabase from './supabase';

export const getUserNotifications = async () => {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    throw new Error(sessionError.message);
  }

  const { data, error } = await supabase
    .from('appointments')
    .select(
      `
          *,
          tutor_services!inner (
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
    .or(
      `status.eq.${APPOINTMENT_STATUS.REJECTED},status.eq.${APPOINTMENT_STATUS.REPORTED},status.eq.${APPOINTMENT_STATUS.PENDING_PAYMENT}`,
    )
    .eq('user_profile_id', sessionData?.session?.user?.id)
    .order('last_modified', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getTutorNotifications = async () => {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    throw new Error(sessionError.message);
  }

  const { data, error } = await supabase
    .from('appointments')
    .select(
      `
          *,
          tutor_services!inner (
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
    .or(`status.eq.${APPOINTMENT_STATUS.COMPLETE},status.eq.${APPOINTMENT_STATUS.PENDING_APPROVAL}`)
    .eq('tutor_services.tutor_id', sessionData?.session?.user?.id)
    .order('last_modified', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
