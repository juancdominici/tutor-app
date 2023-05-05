import { APPOINTMENT_STATUS } from '@app/constants/constants';
import supabase from './supabase';

export const getTutorReviews = async (tutorId: any) => {
  const { data, error } = await supabase
    .from('reviews')
    .select(`*, tutor_services!inner( *, tutors( id ) ), user_profiles( name )`)
    .eq('tutor_services.tutor_id', tutorId)
    .eq('status', true)
    .lt('report_count', 5);

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const getUnreviewedServices = async (tutorId: any) => {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData?.session?.user?.id;

  const { data: userCompletedAppointmentsWithTutor, error } = await supabase
    .from('appointments')
    .select(`*, tutor_services!inner( *, tutors( id ), reviews( * ) ), user_profiles( name ), appointment_details( * )`)
    .eq('tutor_services.tutor_id', tutorId)
    .eq('status', APPOINTMENT_STATUS.COMPLETE)
    .eq('user_profile_id', userId)
    .order('date', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const unreviewedServices = userCompletedAppointmentsWithTutor?.filter((appointment: any) => {
    const reviews = appointment?.tutor_services?.reviews;
    if (reviews && reviews.length > 0) {
      const review = reviews.find((review: any) => review.user_profile_id === userId);
      if (review) {
        return false;
      }
    }
    return true;
  });

  // Filter repeated services
  const filteredUnreviewedServices = unreviewedServices?.filter(
    (service: any, index: number, self: any) =>
      index === self.findIndex((t: any) => t.tutor_services.id === service.tutor_services.id),
  );

  return filteredUnreviewedServices;
};

export const addReview = async (payload: any) => {
  const { data: session } = await supabase.auth.getSession();
  const userId = session?.session?.user?.id;

  const { data, error } = await supabase.from('reviews').insert({
    ...payload,
    user_profile_id: userId,
  });

  if (error) {
    throw new Error(error.message);
  }
  return { data };
};

export const reportReview = async (payload: any) => {
  const { data, error } = await supabase
    .from('reviews')
    .update({ report_count: payload.report_count })
    .eq('id', payload.id);

  if (error) {
    throw new Error(error.message);
  }

  return { data };
};

export const getTutorQuestions = async (tutorId: any) => {
  const { data, error } = await supabase
    .from('questions')
    .select('*, user_profiles( name )')
    .eq('tutor_id', tutorId)
    .eq('status', true)
    .lt('report_count', 5)
    .order('date', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const addTutorQuestion = async (payload: any) => {
  const { data: session } = await supabase.auth.getSession();
  const userId = session?.session?.user?.id;

  const { data: questions } = await supabase
    .from('questions')
    .select('*')
    .eq('user_profile_id', userId)
    .eq('tutor_id', payload.tutor_id);

  // User can only ask a question if the questions they have asked are all answered or they have no questions for the tutor
  if (questions && questions?.length > 0) {
    const unansweredQuestions = questions?.filter((question: any) => question.a === null);
    if (unansweredQuestions && unansweredQuestions.length > 0) {
      throw new Error('You have an unanswered question for this tutor');
    }
  }

  const { data, error } = await supabase.from('questions').insert({
    tutor_id: payload.tutor_id,
    user_profile_id: userId,
    q: payload.question,
    date: new Date(),
    status: true,
  });

  if (error) {
    throw new Error(error.message);
  }
  return { data };
};

export const answerQuestion = async (payload: any) => {
  const { data, error } = await supabase.from('questions').update({ a: payload.a }).eq('id', payload.id);

  if (error) {
    throw new Error(error.message);
  }
  return { data };
};

export const reportQuestion = async (payload: any) => {
  const { data, error } = await supabase
    .from('questions')
    .update({ report_count: payload.report_count })
    .eq('id', payload.id);

  if (error) {
    throw new Error(error.message);
  }
  return { data };
};

export const getTutorServices = async (tutorId: any) => {
  const { data, error } = await supabase.rpc('get_services_tutor_profile', { tutor_id: tutorId });

  if (error) {
    throw new Error(error.message);
  }
  return data;
};
