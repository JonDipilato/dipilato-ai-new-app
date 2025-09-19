'use client';

import { useState } from 'react';

import { useLocalStorage } from './useLocalStorage';

export type Customer = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  preferences: {
    preferredServices: string[];
    preferredTimes: string[];
    notes: string;
  };
  history: AppointmentHistory[];
  totalVisits: number;
  totalSpent: number;
  averageRating?: number;
  lastVisit?: Date;
  nextReminder?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type AppointmentHistory = {
  id: string;
  service: string;
  date: Date;
  duration: number;
  status: 'completed' | 'cancelled' | 'no-show';
  cost?: number;
  rating?: number;
  notes?: string;
};

export const useCustomers = () => {
  const [customers, setCustomers] = useLocalStorage<Customer[]>('customer-database', []);
  const [isLoading] = useState(false);

  const addCustomer = (customerData: {
    name: string;
    phone: string;
    email?: string;
    service?: string;
    notes?: string;
  }): Customer => {
    const newCustomer: Customer = {
      id: Math.random().toString(36).substr(2, 9),
      name: customerData.name,
      phone: customerData.phone,
      email: customerData.email,
      preferences: {
        preferredServices: customerData.service ? [customerData.service] : [],
        preferredTimes: [],
        notes: customerData.notes || '',
      },
      history: [],
      totalVisits: 0,
      totalSpent: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setCustomers(prev => [newCustomer, ...prev]);
    return newCustomer;
  };

  const updateCustomer = (customerId: string, updates: Partial<Customer>): boolean => {
    setCustomers(prev =>
      prev.map(customer =>
        customer.id === customerId
          ? { ...customer, ...updates, updatedAt: new Date() }
          : customer,
      ),
    );
    return true;
  };

  const addAppointmentToHistory = (customerId: string, appointment: {
    service: string;
    date: Date;
    duration: number;
    status: 'completed' | 'cancelled' | 'no-show';
    cost?: number;
    rating?: number;
    notes?: string;
  }): boolean => {
    const historyEntry: AppointmentHistory = {
      id: Math.random().toString(36).substr(2, 9),
      ...appointment,
    };

    setCustomers(prev =>
      prev.map((customer) => {
        if (customer.id === customerId) {
          const updatedHistory = [historyEntry, ...customer.history];
          const totalVisits = customer.totalVisits + (appointment.status === 'completed' ? 1 : 0);
          const totalSpent = customer.totalSpent + (appointment.cost || 0);

          // Calculate average rating
          const ratingsFromHistory = updatedHistory
            .filter(h => h.rating !== undefined)
            .map(h => h.rating!);
          const averageRating = ratingsFromHistory.length > 0
            ? ratingsFromHistory.reduce((sum, rating) => sum + rating, 0) / ratingsFromHistory.length
            : undefined;

          return {
            ...customer,
            history: updatedHistory,
            totalVisits,
            totalSpent,
            averageRating,
            lastVisit: appointment.status === 'completed' ? appointment.date : customer.lastVisit,
            updatedAt: new Date(),
          };
        }
        return customer;
      }),
    );
    return true;
  };

  const findCustomerByPhone = (phone: string): Customer | undefined => {
    return customers.find(customer => customer.phone === phone);
  };

  const findCustomerByName = (name: string): Customer | undefined => {
    return customers.find(customer =>
      customer.name.toLowerCase().includes(name.toLowerCase()),
    );
  };

  const getCustomerStats = () => {
    return {
      totalCustomers: customers.length,
      activeCustomers: customers.filter(c => c.lastVisit
        && (new Date().getTime() - c.lastVisit.getTime()) < (90 * 24 * 60 * 60 * 1000), // Active in last 90 days
      ).length,
      totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
      averageVisitsPerCustomer: customers.length > 0
        ? customers.reduce((sum, c) => sum + c.totalVisits, 0) / customers.length
        : 0,
      topServices: [],
    };
  };

  const getTopServices = () => {
    const serviceCount: Record<string, number> = {};

    customers.forEach((customer) => {
      customer.history.forEach((appointment) => {
        if (appointment.status === 'completed') {
          serviceCount[appointment.service] = (serviceCount[appointment.service] || 0) + 1;
        }
      });
    });

    return Object.entries(serviceCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([service, count]) => ({ service, count }));
  };

  const getCustomersNeedingFollowUp = (): Customer[] => {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    return customers.filter((customer) => {
      const lastCompleted = customer.history
        .filter(h => h.status === 'completed')
        .sort((a, b) => b.date.getTime() - a.date.getTime())[0];

      return lastCompleted
        && lastCompleted.date <= threeDaysAgo
        && !customer.history.some(h => h.date > lastCompleted.date && h.notes?.includes('follow-up sent'));
    });
  };

  const markFollowUpSent = (customerId: string): boolean => {
    return addAppointmentToHistory(customerId, {
      service: 'Follow-up',
      date: new Date(),
      duration: 0,
      status: 'completed',
      notes: 'follow-up sent',
    });
  };

  return {
    customers,
    isLoading,
    addCustomer,
    updateCustomer,
    addAppointmentToHistory,
    findCustomerByPhone,
    findCustomerByName,
    getCustomerStats,
    getTopServices,
    getCustomersNeedingFollowUp,
    markFollowUpSent,
  };
};
