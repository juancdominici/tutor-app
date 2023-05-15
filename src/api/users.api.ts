import { createClient } from '@supabase/supabase-js';

const url: any = process.env.REACT_APP_SUPABASE_URL;
const adminKey: any = process.env.REACT_APP_SUPABASE_ADMIN_KEY;
const supabase = createClient(url, adminKey);

export const getUsers = async () => {
  const { data, error } = await supabase.auth.admin.listUsers();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const postUser = async (user: any) => {
  const { error } = await supabase.auth.admin.createUser({
    ...user,
  });

  if (error) {
    throw new Error(error.message);
  }
};

export const putUser = async (user: any) => {
  const { error } = await supabase.auth.admin.updateUserById(user.id, {
    ...user,
  });
  if (error) {
    throw new Error(error.message);
  }
};

export const getUser = async (id: any) => {
  const { data, error } = await supabase.auth.admin.getUserById(id);

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const deleteUser = async (id: any) => {
  const { data, error } = await supabase.auth.admin.deleteUser(id);

  if (error) {
    throw new Error(error.message);
  }
  return data;
};
