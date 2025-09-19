'use client';

// import { useTranslations } from 'next-intl'; // For future localization
import { BarChart3, Calendar, Clock, DollarSign, TrendingUp, Users } from 'lucide-react';

import { useAppointments } from '@/hooks/useAppointments';
import { useCustomers } from '@/hooks/useCustomers';

export const BusinessAnalyticsWidget = () => {
  // const t = useTranslations('Analytics'); // For future localization
  const { getCustomerStats, getTopServices } = useCustomers();
  const { getAllAppointments } = useAppointments();

  const customerStats = getCustomerStats();
  const topServices = getTopServices();
  const allAppointments = getAllAppointments();

  // Calculate this month's stats
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisMonthAppointments = allAppointments.filter(
    apt => apt.date >= startOfMonth,
  );

  const thisMonthRevenue = thisMonthAppointments
    .filter(apt => apt.status === 'completed')
    .reduce((sum, apt) => sum + (apt.cost || 0), 0);

  const thisMonthBookings = thisMonthAppointments.length;
  const completionRate = thisMonthAppointments.length > 0
    ? (thisMonthAppointments.filter(apt => apt.status === 'completed').length / thisMonthAppointments.length) * 100
    : 0;

  // Peak hours analysis
  const hourlyBookings: Record<number, number> = {};
  allAppointments.forEach((apt) => {
    const hour = apt.date.getHours();
    hourlyBookings[hour] = (hourlyBookings[hour] || 0) + 1;
  });

  const peakHour = Object.entries(hourlyBookings)
    .sort(([, a], [, b]) => b - a)[0];

  const peakHourFormatted = peakHour
    ? `${Number.parseInt(peakHour[0]) % 12 || 12}${Number.parseInt(peakHour[0]) >= 12 ? 'PM' : 'AM'}`
    : 'N/A';

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <div className="mr-3 rounded-full bg-purple-100 p-2">
            <BarChart3 className="size-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Business Analytics</h2>
            <p className="text-sm text-muted-foreground">Track your business performance and growth</p>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-lg bg-blue-50 p-4 text-center">
          <div className="mb-2 flex items-center justify-center">
            <DollarSign className="size-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-600">
            $
            {thisMonthRevenue.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">This Month Revenue</div>
        </div>

        <div className="rounded-lg bg-green-50 p-4 text-center">
          <div className="mb-2 flex items-center justify-center">
            <Calendar className="size-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-600">{thisMonthBookings}</div>
          <div className="text-sm text-muted-foreground">Bookings This Month</div>
        </div>

        <div className="rounded-lg bg-purple-50 p-4 text-center">
          <div className="mb-2 flex items-center justify-center">
            <Users className="size-5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-600">{customerStats.totalCustomers}</div>
          <div className="text-sm text-muted-foreground">Total Customers</div>
        </div>

        <div className="rounded-lg bg-orange-50 p-4 text-center">
          <div className="mb-2 flex items-center justify-center">
            <TrendingUp className="size-5 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-orange-600">
            {completionRate.toFixed(1)}
            %
          </div>
          <div className="text-sm text-muted-foreground">Completion Rate</div>
        </div>
      </div>

      {/* Business Insights */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">Business Insights</h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border p-4">
            <div className="mb-2 flex items-center">
              <Clock className="mr-2 size-4 text-gray-600" />
              <span className="font-medium">Peak Hours</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your busiest hour is
              {' '}
              <span className="font-medium text-gray-900">{peakHourFormatted}</span>
              {peakHour && ` with ${peakHour[1]} bookings`}
            </p>
          </div>

          <div className="rounded-lg border p-4">
            <div className="mb-2 flex items-center">
              <TrendingUp className="mr-2 size-4 text-gray-600" />
              <span className="font-medium">Customer Loyalty</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Average of
              {' '}
              <span className="font-medium text-gray-900">{customerStats.averageVisitsPerCustomer.toFixed(1)}</span>
              {' '}
              visits per customer
            </p>
          </div>
        </div>

        {/* Top Services */}
        <div className="rounded-lg border p-4">
          <h4 className="mb-3 font-medium">Top Services</h4>
          <div className="space-y-2">
            {topServices.map((service, index) => (
              <div key={service.service} className="flex items-center justify-between">
                <span className="text-sm">
                  {index + 1}
                  .
                  {' '}
                  {service.service}
                </span>
                <span className="text-sm font-medium">
                  {service.count}
                  {' '}
                  bookings
                </span>
              </div>
            ))}
            {customerStats.topServices.length === 0 && (
              <p className="text-sm text-muted-foreground">No completed services yet</p>
            )}
          </div>
        </div>

        {/* Active Customers */}
        <div className="rounded-lg border p-4">
          <h4 className="mb-2 font-medium">Customer Activity</h4>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-green-600">{customerStats.activeCustomers}</span>
            {' '}
            of
            {' '}
            <span className="font-medium">{customerStats.totalCustomers}</span>
            {' '}
            customers
            {' '}
            visited in the last 90 days
          </p>
          {customerStats.totalCustomers > 0 && (
            <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-green-600"
                style={{
                  width: `${(customerStats.activeCustomers / customerStats.totalCustomers) * 100}%`,
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
