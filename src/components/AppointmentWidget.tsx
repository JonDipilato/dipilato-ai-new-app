'use client';

import { Calendar, Clock, Plus, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppointments } from '@/hooks/useAppointments';
import { useUsageTracking } from '@/hooks/useUsageTracking';

export const AppointmentWidget = () => {
  const t = useTranslations('Appointments');
  const { getTodayAppointments, getUpcomingAppointments, addAppointment } = useAppointments();
  const { canUseFeature, trackUsage } = useUsageTracking();
  const [showAddDialog, setShowAddDialog] = useState(false);

  const sendSMSConfirmation = async (appointmentData: {
    customerName: string;
    customerPhone: string;
    appointmentDate: Date;
    service: string;
    businessName: string;
    duration: number;
  }) => {
    try {
      const response = await fetch('/api/sms/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'confirmation',
          ...appointmentData,
        }),
      });

      if (response.ok) {
        // SMS confirmation sent successfully
      } else {
        console.error('Failed to send SMS confirmation');
      }
    } catch (error) {
      console.error('Error sending SMS confirmation:', error);
    }
  };
  const [newAppointment, setNewAppointment] = useState({
    customerName: '',
    service: '',
    date: '',
    time: '',
    duration: 60,
    phoneNumber: '',
  });

  const todayAppointments = getTodayAppointments();
  const upcomingAppointments = getUpcomingAppointments();

  const handleAddAppointment = () => {
    if (!newAppointment.customerName || !newAppointment.service || !newAppointment.date || !newAppointment.time) {
      return;
    }

    // Check if user can book appointments
    if (!canUseFeature('appointmentBookings')) {
      // eslint-disable-next-line no-alert
      alert('You have reached your appointment booking limit for this month. Please upgrade your plan.');
      return;
    }

    const appointmentDate = new Date(`${newAppointment.date}T${newAppointment.time}`);

    addAppointment({
      customerName: newAppointment.customerName,
      service: newAppointment.service,
      date: appointmentDate,
      duration: newAppointment.duration,
      status: 'confirmed',
      phoneNumber: newAppointment.phoneNumber,
    });

    // Track the usage
    trackUsage('appointmentBookings');

    // Send SMS confirmation if phone number provided
    if (newAppointment.phoneNumber) {
      sendSMSConfirmation({
        customerName: newAppointment.customerName,
        customerPhone: newAppointment.phoneNumber,
        appointmentDate,
        service: newAppointment.service,
        businessName: 'Your Business', // You can make this configurable
        duration: newAppointment.duration,
      });
    }

    // Reset form
    setNewAppointment({
      customerName: '',
      service: '',
      date: '',
      time: '',
      duration: 60,
      phoneNumber: '',
    });
    setShowAddDialog(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return t('status_confirmed');
      case 'pending': return t('status_pending');
      case 'completed': return t('status_completed');
      default: return status;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // upcomingAppointments is already defined above via getUpcomingAppointments()

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <div className="mr-3 rounded-full bg-green-100 p-2">
            <Calendar className="size-5 text-green-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">{t('title')}</h2>
            <p className="text-sm text-muted-foreground">{t('description')}</p>
          </div>
        </div>
        <Button size="sm" onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 size-4" />
          {t('add_appointment')}
        </Button>
      </div>

      {/* Today's Stats */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{todayAppointments.length}</div>
          <div className="text-sm text-muted-foreground">{t('today_total')}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {todayAppointments.filter(apt => apt.status === 'confirmed').length}
          </div>
          <div className="text-sm text-muted-foreground">{t('confirmed')}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {todayAppointments.reduce((total, apt) => total + apt.duration, 0)}
            m
          </div>
          <div className="text-sm text-muted-foreground">{t('total_duration')}</div>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div>
        <h3 className="mb-3 font-medium">{t('upcoming')}</h3>
        <div className="space-y-3">
          {upcomingAppointments.map(appointment => (
            <div key={appointment.id} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
              <div className="flex items-center">
                <div className="mr-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-teal-500 text-sm font-medium text-white">
                    {appointment.customerName.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
                <div>
                  <div className="font-medium">{appointment.customerName}</div>
                  <div className="text-sm text-muted-foreground">{appointment.service}</div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="flex items-center text-sm font-medium">
                    <Clock className="mr-1 size-3" />
                    {formatTime(appointment.date)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {appointment.duration}
                    {' '}
                    minutes
                  </div>
                </div>
                <div className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(appointment.status)}`}>
                  {getStatusText(appointment.status)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {upcomingAppointments.length === 0 && (
        <div className="py-8 text-center">
          <Calendar className="mx-auto mb-4 size-12 text-muted-foreground" />
          <h3 className="mb-2 font-medium">{t('no_appointments_title')}</h3>
          <p className="mb-4 text-sm text-muted-foreground">{t('no_appointments_description')}</p>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 size-4" />
            {t('add_appointment')}
          </Button>
        </div>
      )}

      {/* Add Appointment Dialog */}
      {showAddDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="max-h-[90vh] w-96 overflow-y-auto rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Add New Appointment</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddDialog(false)}
              >
                <X className="size-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="customerName" className="text-sm font-medium">Customer Name *</label>
                <Input
                  type="text"
                  id="customerName"
                  placeholder="John Doe"
                  value={newAppointment.customerName}
                  onChange={e => setNewAppointment(prev => ({ ...prev, customerName: e.target.value }))}
                />
              </div>

              <div>
                <label htmlFor="service" className="text-sm font-medium">Service *</label>
                <Input
                  type="text"
                  id="service"
                  placeholder="Haircut, Consultation, etc."
                  value={newAppointment.service}
                  onChange={e => setNewAppointment(prev => ({ ...prev, service: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="date" className="text-sm font-medium">Date *</label>
                  <Input
                    id="date"
                    type="date"
                    value={newAppointment.date}
                    onChange={e => setNewAppointment(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                <div>
                  <label htmlFor="time" className="text-sm font-medium">Time *</label>
                  <Input
                    id="time"
                    type="time"
                    value={newAppointment.time}
                    onChange={e => setNewAppointment(prev => ({ ...prev, time: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="duration" className="text-sm font-medium">Duration (minutes)</label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="60"
                  value={newAppointment.duration}
                  onChange={e => setNewAppointment(prev => ({ ...prev, duration: Number.parseInt(e.target.value) || 60 }))}
                />
              </div>

              <div>
                <label htmlFor="phoneNumber" className="text-sm font-medium">Phone Number</label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={newAppointment.phoneNumber}
                  onChange={e => setNewAppointment(prev => ({ ...prev, phoneNumber: e.target.value }))}
                />
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <Button
                onClick={handleAddAppointment}
                disabled={!newAppointment.customerName || !newAppointment.service || !newAppointment.date || !newAppointment.time}
                className="flex-1"
              >
                <Plus className="mr-2 size-4" />
                Add Appointment
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowAddDialog(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
