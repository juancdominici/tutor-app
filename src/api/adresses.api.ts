import supabase from './supabase';

export const getTutorAddressesFiltered = async () =>
  /* priceFilter: number[],
  serviceTypeFilter: string[],
  reviewFilter: number[], */
  {
    const { data, error } = await supabase.from('addresses').select('*, tutors(*)').eq('status', true);

    if (error) {
      throw new Error(error.message);
    }
    return data;
  };
