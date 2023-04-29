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
