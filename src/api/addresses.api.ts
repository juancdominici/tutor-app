import { checkUserExistance } from './auth.api';
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

export const getUserAddresses = async () => {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('status', true)
    .or(`user_profile_id.eq.${sessionData?.session?.user?.id},tutor_id.eq.${sessionData?.session?.user?.id}`);

  if (error) {
    throw new Error(error.message);
  }
  if (sessionError) {
    throw new Error(sessionError.message);
  }
  return data;
};

export const postAddress = async (address: any) => {
  const userType = await checkUserExistance();
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    throw new Error(sessionError.message);
  }

  const { error } = await supabase
    .from('addresses')
    .insert({
      ...address,
      user_profile_id: userType === 'user' ? sessionData?.session?.user?.id : null,
      tutor_id: userType === 'tutor' ? sessionData?.session?.user?.id : null,
    })
    .single();

  if (error) {
    throw new Error(error.message);
  }
};

export const putAddress = async (address: any) => {
  const { error } = await supabase
    .from('addresses')
    .update({ ...address })
    .eq('id', address.id)
    .single();

  if (error) {
    throw new Error(error.message);
  }
};

export const getAddress = async (id: any) => {
  const { data, error } = await supabase.rpc('get_address_by_id', { address_id: id });

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const deleteAddress = async (id: any) => {
  const { data, error } = await supabase.from('addresses').delete().eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
  return data;
};
