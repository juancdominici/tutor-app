import { APPOINTMENT_STATUS } from '@app/constants/constants';
import supabase from './supabase';
import moment from 'moment';
import { checkUserExistance } from './auth.api';
import { HttpError } from '@app/constants/errors';

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
      for (let i = 0; i < 12; i++) {
        arr.push(moment().subtract(i, 'months').format('MM/YYYY'));
      }
      break;
    default:
      break;
  }

  return arr.reverse();
};

const appointmentsArrayByDate = (appointments: any, dateDiff: DateDiff) => {
  const arr = [];
  switch (dateDiff) {
    case 'week':
      for (let i = 0; i < 7; i++) {
        arr.push(
          appointments
            .filter((appointment: any) => moment(appointment.last_modified).isSame(moment().subtract(i, 'days'), 'day'))
            .map((appointment: any) => {
              const { price, is_unit_price } = appointment.tutor_services;
              let total_price = 0;
              if (is_unit_price) {
                appointment.appointment_details.forEach((detail: any) => {
                  total_price += detail.quantity * price;
                });
              } else {
                total_price = price;
              }
              return total_price;
            })
            .reduce((a: any, b: any) => a + b, 0),
        );
      }
      break;
    case 'month':
      for (let i = 0; i < 30; i++) {
        arr.push(
          appointments
            .filter((appointment: any) => moment(appointment.last_modified).isSame(moment().subtract(i, 'days'), 'day'))
            .map((appointment: any) => {
              const { price, is_unit_price } = appointment.tutor_services;
              let total_price = 0;
              if (is_unit_price) {
                appointment.appointment_details.forEach((detail: any) => {
                  total_price += detail.quantity * price;
                });
              } else {
                total_price = price;
              }
              return total_price;
            })
            .reduce((a: any, b: any) => a + b, 0),
        );
      }
      break;
    case 'year':
      for (let i = 0; i < 12; i++) {
        arr.push(
          appointments
            .filter((appointment: any) =>
              moment(appointment.last_modified).isSame(moment().subtract(i, 'months'), 'month'),
            )
            .map((appointment: any) => {
              const { price, is_unit_price } = appointment.tutor_services;
              let total_price = 0;
              if (is_unit_price) {
                appointment.appointment_details.forEach((detail: any) => {
                  total_price += detail.quantity * price;
                });
              } else {
                total_price = price;
              }
              return total_price;
            })
            .reduce((a: any, b: any) => a + b, 0),
        );
      }
      break;
  }
  return arr.reverse();
};

const countServiceByDate = (appointments: any, dateDiff: DateDiff) => {
  // count active appointments by from last "DateDiff" days
  switch (dateDiff) {
    case 'week':
      return appointments
        .filter((appointment: any) => moment(appointment.date).isBetween(moment().subtract(1, 'week'), moment()))
        .reduce((acc: any, appointment: any) => {
          const index = acc.findIndex((item: any) => item.name === appointment.tutor_services.name);

          if (index === -1) {
            acc.push({
              name:
                appointment.tutor_services.name.slice(0, 20) +
                (appointment.tutor_services.name.length > 20 ? '...' : ''),
              description: appointment.tutor_services.name,
              value: 1,
            });
          } else {
            acc[index].value += 1;
          }

          return acc;
        }, []);

    case 'month':
      return appointments
        .filter((appointment: any) => moment(appointment.date).isBetween(moment().subtract(1, 'month'), moment()))
        .reduce((acc: any, appointment: any) => {
          const index = acc.findIndex((item: any) => item.name === appointment.tutor_services.name);

          if (index === -1) {
            acc.push({
              name:
                appointment.tutor_services.name.slice(0, 20) +
                (appointment.tutor_services.name.length > 20 ? '...' : ''),
              description: appointment.tutor_services.name,
              value: 1,
            });
          } else {
            acc[index].value += 1;
          }

          return acc;
        }, []);
    case 'year':
      return appointments
        .filter((appointment: any) => moment(appointment.date).isBetween(moment().subtract(1, 'year'), moment()))
        .reduce((acc: any, appointment: any) => {
          const index = acc.findIndex((item: any) => item.name === appointment.tutor_services.name);

          if (index === -1) {
            acc.push({
              name:
                appointment.tutor_services.name.slice(0, 20) +
                (appointment.tutor_services.name.length > 20 ? '...' : ''),
              description: appointment.tutor_services.name,
              value: 1,
            });
          } else {
            acc[index].value += 1;
          }

          return acc;
        }, []);
  }
};

const countServiceAmountByDate = (appointments: any, dateDiff: DateDiff) => {
  switch (dateDiff) {
    case 'week':
      return appointments
        .filter((appointment: any) => moment(appointment.date).isBetween(moment().subtract(1, 'week'), moment()))
        .reduce((acc: any, appointment: any) => {
          const { price, is_unit_price } = appointment.tutor_services;
          let total_price = 0;

          if (is_unit_price) {
            appointment.appointment_details.forEach((detail: any) => {
              total_price += detail.quantity * price;
            });
          } else {
            total_price = price;
          }

          const index = acc.findIndex((item: any) => item.name === appointment.tutor_services.name);

          if (index === -1) {
            acc.push({
              name:
                appointment.tutor_services.name.slice(0, 20) +
                (appointment.tutor_services.name.length > 20 ? '...' : ''),
              description: appointment.tutor_services.name,
              value: total_price,
            });
          } else {
            acc[index].value += total_price;
          }

          return acc;
        }, []);
    case 'month':
      return appointments
        .filter((appointment: any) => moment(appointment.date).isBetween(moment().subtract(1, 'month'), moment()))
        .reduce((acc: any, appointment: any) => {
          const { price, is_unit_price } = appointment.tutor_services;
          let total_price = 0;

          if (is_unit_price) {
            appointment.appointment_details.forEach((detail: any) => {
              total_price += detail.quantity * price;
            });
          } else {
            total_price = price;
          }

          const index = acc.findIndex((item: any) => item.name === appointment.tutor_services.name);

          if (index === -1) {
            acc.push({
              name:
                appointment.tutor_services.name.slice(0, 20) +
                (appointment.tutor_services.name.length > 20 ? '...' : ''),
              description: appointment.tutor_services.name,
              value: total_price,
            });
          } else {
            acc[index].value += total_price;
          }

          return acc;
        }, []);
    case 'year':
      return appointments
        .filter((appointment: any) => moment(appointment.date).isBetween(moment().subtract(1, 'year'), moment()))
        .reduce((acc: any, appointment: any) => {
          const { price, is_unit_price } = appointment.tutor_services;
          let total_price = 0;

          if (is_unit_price) {
            appointment.appointment_details.forEach((detail: any) => {
              total_price += detail.quantity * price;
            });
          } else {
            total_price = price;
          }

          const index = acc.findIndex((item: any) => item.name === appointment.tutor_services.name);

          if (index === -1) {
            acc.push({
              name:
                appointment.tutor_services.name.slice(0, 20) +
                (appointment.tutor_services.name.length > 20 ? '...' : ''),
              description: appointment.tutor_services.name,
              value: total_price,
            });
          } else {
            acc[index].value += total_price;
          }

          return acc;
        }, []);
  }
};

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
      last_modified: new Date(),
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
    .eq('user_profile_id', sessionData?.session?.user?.id)
    .order('last_modified', { ascending: false });

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
    .neq('status', APPOINTMENT_STATUS.PENDING_APPROVAL)
    .eq('tutor_services.tutor_id', sessionData?.session?.user?.id)
    .order('last_modified', { ascending: false });

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
    .eq('status', APPOINTMENT_STATUS.PENDING_APPROVAL)
    .eq('tutor_services.tutor_id', sessionData?.session?.user?.id)
    .order('last_modified', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

const checkAppointmentDate = async (id: any, status: any) => {
  const { data: appointmentData, error: appointmentError } = await supabase
    .from('appointments')
    .select('*')
    .eq('id', id)
    .single();

  if (appointmentError) {
    throw new Error(appointmentError.message);
  }

  // For appointments that are pending approval, check if the date is in the past
  if (appointmentData?.status === APPOINTMENT_STATUS.PENDING_APPROVAL && status === APPOINTMENT_STATUS.IN_PROGRESS) {
    if (moment(`${appointmentData?.date} ${appointmentData?.time}`).isBefore(moment())) {
      throw new HttpError('Appointment date is in the past', '409');
    }
  }
};

export const changeAppointmentStatus = async (payload: any) => {
  await checkAppointmentDate(payload.id, payload.status);

  const { data, error } = await supabase
    .from('appointments')
    .update({ status: payload.status, last_modified: new Date() })
    .eq('id', payload.id)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getAppointmentStatistics = async (dateDiff: any, appointmentType: any) => {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    throw new Error(sessionError.message);
  }

  const userType = await checkUserExistance();

  const query = supabase
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
    .eq('status', appointmentType || APPOINTMENT_STATUS.COMPLETE);

  if (userType === 'user') query.eq('user_profile_id', sessionData?.session?.user?.id);
  if (userType === 'tutor') query.eq('tutor_services.tutor_id', sessionData?.session?.user?.id);

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }
  return {
    userCountArr: appointmentsArrayByDate(data, dateDiff),
    days: arrayDays(dateDiff),
    userType,
  } as any;
};

export const getTutorAppointmentsStatistics = async (dateDiff: any) => {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    throw new Error(sessionError.message);
  }

  const { data: pendingRequests, error: pendingRequestsError } = await supabase
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
    .eq('tutor_services.tutor_id', sessionData?.session?.user?.id)
    .eq('status', APPOINTMENT_STATUS.PENDING_APPROVAL);
  if (pendingRequestsError) {
    throw new Error(pendingRequestsError.message);
  }

  const { data: closeAppointments, error: closeAppointmentsError } = await supabase
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
    .eq('tutor_services.tutor_id', sessionData?.session?.user?.id)
    .eq('status', APPOINTMENT_STATUS.IN_PROGRESS);

  if (closeAppointmentsError) {
    throw new Error(closeAppointmentsError.message);
  }

  const { data: appointmentsPerService, error: appointmentsPerServiceError } = await supabase
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
    .eq('tutor_services.tutor_id', sessionData?.session?.user?.id)
    .eq('status', APPOINTMENT_STATUS.COMPLETE);

  if (appointmentsPerServiceError) {
    throw new Error(appointmentsPerServiceError.message);
  }

  return {
    pendingRequests,
    closeAppointments,
    appointmentsPerServiceWithPrice: countServiceAmountByDate(appointmentsPerService, dateDiff),
    appointmentsPerService: countServiceByDate(appointmentsPerService, dateDiff),
  };
};

export const getAppointmentById = async (id: any) => {
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
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
