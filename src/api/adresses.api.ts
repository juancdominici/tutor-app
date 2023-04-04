import supabase from './supabase';

export const getTutorAddressesFiltered = async () =>
  /* priceFilter: number[],
  serviceTypeFilter: string[],
  reviewFilter: number[], */
  {
    const { data, error } = await supabase.from('addresses').select('*').neq('tutor_id', null);

    if (error) {
      throw new Error(error.message);
    }
    return data;
  };
