'use client';

import { useLocalStorage } from './useLocalStorage';

type Appointment = {
  id: string;
  customerName: string;
  service: string;
  date: Date;
  duration: number;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled' | 'no-show';
  phoneNumber?: string;
  notes?: string;
  cost?: number;
  rating?: number;
  reminderSent?: boolean;
  confirmationSent?: boolean;
  followUpSent?: boolean;
};

export const useAppointments = () => {
  const [appointments, setAppointments] = useLocalStorage<Appointment[]>('appointments', []);

  const addAppointment = (appointmentData: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = {
      id: Math.random().toString(36).substr(2, 9),
      ...appointmentData,
    };

    setAppointments(prev => [...prev, newAppointment]);
    return newAppointment;
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments(prev =>
      prev.map(apt => (apt.id === id ? { ...apt, ...updates } : apt)),
    );
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(apt => apt.id !== id));
  };

  const getTodayAppointments = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return appointments.filter((apt) => {
      const aptDate = new Date(apt.date);
      return aptDate >= today && aptDate < tomorrow;
    });
  };

  const getUpcomingAppointments = () => {
    const now = new Date();
    return appointments
      .filter(apt => new Date(apt.date) > now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const getAllAppointments = () => {
    return appointments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const getAppointmentsByStatus = (status: Appointment['status']) => {
    return appointments.filter(apt => apt.status === status);
  };

  const getAppointmentsNeedingReminders = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

    return appointments.filter((apt) => {
      const aptDate = new Date(apt.date);
      return aptDate >= tomorrow
        && aptDate < dayAfterTomorrow
        && apt.status === 'confirmed'
        && !apt.reminderSent;
    });
  };

  const markReminderSent = (appointmentId: string) => {
    updateAppointment(appointmentId, { reminderSent: true });
  };

  const markConfirmationSent = (appointmentId: string) => {
    updateAppointment(appointmentId, { confirmationSent: true });
  };

  const markFollowUpSent = (appointmentId: string) => {
    updateAppointment(appointmentId, { followUpSent: true });
  };

  return {
    appointments,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    getTodayAppointments,
    getUpcomingAppointments,
    getAllAppointments,
    getAppointmentsByStatus,
    getAppointmentsNeedingReminders,
    markReminderSent,
    markConfirmationSent,
    markFollowUpSent,
  };
};
