import { LOCATION_TYPE } from '@app/constants/constants';
import { SERVICE_TYPE } from '@app/constants/constants';
import { createClient } from '@supabase/supabase-js';
import moment from 'moment';

const url: any = process.env.REACT_APP_SUPABASE_URL;
const adminKey: any = process.env.REACT_APP_SUPABASE_ADMIN_KEY;
const supabase = createClient(url, adminKey);

type DateDiff = 'week' | 'month' | 'year';

const arrayDays = (dateDiff: DateDiff) => {
  const arr: any = [];

  // return last "DateDiff" days in array
  switch (dateDiff) {
    case 'week':
      for (let i = 0; i < 7; i++) {
        arr.push(moment().subtract(i, 'days').format('DD/MM/YYYY'));
      }
      break;
    case 'month':
      for (let i = 0; i < 30; i++) {
        arr.push(moment().subtract(i, 'days').format('DD/MM/YYYY'));
      }
      break;
    case 'year':
      for (let i = 0; i < 365; i++) {
        arr.push(moment().subtract(i, 'days').format('DD/MM/YYYY'));
      }
      break;
    default:
      break;
  }

  return arr;
};

const countActiveByDate = (users: any, dateDiff: DateDiff) => {
  // count active users by from last "DateDiff" days
  switch (dateDiff) {
    case 'week':
      return users.filter((user: any) => moment(user.last_sign_in_at).isBetween(moment().subtract(1, 'week'), moment()))
        .length;
    case 'month':
      return users.filter((user: any) =>
        moment(user.last_sign_in_at).isBetween(moment().subtract(1, 'month'), moment()),
      ).length;
    case 'year':
      return users.filter((user: any) => moment(user.last_sign_in_at).isBetween(moment().subtract(1, 'year'), moment()))
        .length;
  }
};

const countNewByDate = (users: any, dateDiff: DateDiff) => {
  switch (dateDiff) {
    case 'week':
      return users.filter((user: any) => moment(user.created_at).isBetween(moment().subtract(1, 'week'), moment()))
        .length;
    case 'month':
      return users.filter((user: any) => moment(user.created_at).isBetween(moment().subtract(1, 'month'), moment()))
        .length;
    case 'year':
      return users.filter((user: any) => moment(user.created_at).isBetween(moment().subtract(1, 'year'), moment()))
        .length;
  }
};

const newUsersArrayByDate = (users: any, dateDiff: DateDiff) => {
  const arr = [];
  switch (dateDiff) {
    case 'week':
      for (let i = 0; i < 7; i++) {
        arr.push(
          users.filter((user: any) => moment(user.created_at).isSame(moment().subtract(i, 'days'), 'day')).length,
        );
      }
      break;
    case 'month':
      for (let i = 0; i < 30; i++) {
        arr.push(
          users.filter((user: any) => moment(user.created_at).isSame(moment().subtract(i, 'days'), 'day')).length,
        );
      }
      break;
    case 'year':
      for (let i = 0; i < 365; i++) {
        arr.push(
          users.filter((user: any) => moment(user.created_at).isSame(moment().subtract(i, 'days'), 'day')).length,
        );
      }
      break;
  }
  return arr;
};

export const getUsers = async () => {
  const { data, error } = await supabase.auth.admin.listUsers();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getUserStatistics = async (dateDiff: DateDiff) => {
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) {
    throw new Error(error.message);
  }

  const { data: users, error: errorUsers } = await supabase
    .from('user_profiles')
    .select('id', { count: 'exact' })
    .eq('status', true);
  if (errorUsers) {
    throw new Error(errorUsers.message);
  }

  const { data: tutors, error: errorTutors } = await supabase
    .from('tutors')
    .select('id', { count: 'exact' })
    .eq('status', true);
  if (errorTutors) {
    throw new Error(errorTutors.message);
  }

  return {
    userCount: data.users.length,
    userTypeCount: [
      {
        name: 'Usuario',
        description: 'Usuario',
        value: users?.length || 0,
      },
      {
        name: 'Tutor',
        description: 'Tutor',
        value: tutors?.length || 0,
      },
    ],
    providerCount: [
      {
        name: 'Google',
        description: 'Google',
        value: data.users.filter((user: any) => user.app_metadata.provider === 'google').length,
      },
      {
        name: 'Email',
        description: 'Email',
        value: data.users.filter((user: any) => user.app_metadata.provider === 'email').length,
      },
    ],
    activeUserCount: countActiveByDate(data.users, dateDiff),
    newUsersCount: countNewByDate(data.users, dateDiff),
    userCountArr: newUsersArrayByDate(data.users, dateDiff),
    days: arrayDays(dateDiff),
  } as any;
};

export const getServiceStatistics = async (dateDiff: DateDiff) => {
  const { data, error } = await supabase.from('tutor_services').select('*').eq('status', true);

  if (error) {
    throw new Error(error.message);
  }

  const { data: appointments, error: errorAppointments } = await supabase
    .from('appointments')
    .select('*, tutor_services(*)')
    .lte('created', moment().format('YYYY-MM-DD'))
    .gte('created', moment().subtract(1, dateDiff).format('YYYY-MM-DD'));

  if (errorAppointments) {
    throw new Error(errorAppointments.message);
  }

  return {
    serviceCount: data?.length || 0,
    serviceByCategoryCount: [
      {
        name: 'Cuidado general',
        description: 'Cuidado general',
        value: data?.filter((service: any) => service.type === SERVICE_TYPE[0])?.length,
      },
      {
        name: 'Consejería',
        description: 'Consejería',
        value: data?.filter((service: any) => service.type === SERVICE_TYPE[1])?.length,
      },
      {
        name: 'Cuidado especial',
        description: 'Cuidado especial',
        value: data?.filter((service: any) => service.type === SERVICE_TYPE[2])?.length,
      },
      {
        name: 'Cuidado rutinario',
        description: 'Cuidado rutinario',
        value: data?.filter((service: any) => service.type === SERVICE_TYPE[3])?.length,
      },
      {
        name: 'Guardería',
        description: 'Guardería',
        value: data?.filter((service: any) => service.type === SERVICE_TYPE[4])?.length,
      },
      {
        name: 'Diseño',
        description: 'Diseño',
        value: data?.filter((service: any) => service.type === SERVICE_TYPE[5])?.length,
      },
      {
        name: 'Otro',
        description: 'Otro',
        value: data?.filter((service: any) => service.type === SERVICE_TYPE[6])?.length,
      },
    ],
    serviceByLocationTypeCount: [
      {
        name: 'A domicilio',
        description: 'A domicilio',
        value: data?.filter((service: any) => service.location === LOCATION_TYPE[0])?.length,
      },
      {
        name: 'En casa del tutor',
        description: 'En casa del tutor',
        value: data?.filter((service: any) => service.location === LOCATION_TYPE[1])?.length,
      },
      {
        name: 'Online',
        description: 'Online',
        value: data?.filter((service: any) => service.location === LOCATION_TYPE[2])?.length,
      },
    ],
    appointmentsByServiceType: [
      {
        name: 'Cuidado general',
        description: 'Cuidado general',
        value: appointments?.filter((appointment: any) => appointment.tutor_services.type === SERVICE_TYPE[0])?.length,
      },
      {
        name: 'Consejería',
        description: 'Consejería',
        value: appointments?.filter((appointment: any) => appointment.tutor_services.type === SERVICE_TYPE[1])?.length,
      },
      {
        name: 'Cuidado especial',
        description: 'Cuidado especial',
        value: appointments?.filter((appointment: any) => appointment.tutor_services.type === SERVICE_TYPE[2])?.length,
      },
      {
        name: 'Cuidado rutinario',
        description: 'Cuidado rutinario',
        value: appointments?.filter((appointment: any) => appointment.tutor_services.type === SERVICE_TYPE[3])?.length,
      },
      {
        name: 'Guardería',
        description: 'Guardería',
        value: appointments?.filter((appointment: any) => appointment.tutor_services.type === SERVICE_TYPE[4])?.length,
      },
      {
        name: 'Diseño',
        description: 'Diseño',
        value: appointments?.filter((appointment: any) => appointment.tutor_services.type === SERVICE_TYPE[5])?.length,
      },
      {
        name: 'Otro',
        description: 'Otro',
        value: appointments?.filter((appointment: any) => appointment.tutor_services.type === SERVICE_TYPE[6])?.length,
      },
    ],
  } as any;
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
