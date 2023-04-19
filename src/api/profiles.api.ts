import supabase from './supabase';

export const getTutorReviews = async (tutorId: any) => {
  const { data, error } = await supabase
    .from('tutor_services')
    .select(`*, reviews( * ), tutors( id )`)
    .eq('tutor_id', tutorId)
    .eq('reviews.status', true)
    .lt('reviews.report_count', 5);

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const getTutorQuestions = async (tutorId: any) => {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('tutor_id', tutorId)
    .eq('status', true)
    .order('date', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const getTutorServices = async (tutorId: any) => {
  const { data, error } = await supabase.rpc('get_services_tutor_profile', { tutor_id: tutorId });

  if (error) {
    throw new Error(error.message);
  }
  return data;
};
