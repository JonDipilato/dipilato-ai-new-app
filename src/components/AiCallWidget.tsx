'use client';

import { Clock, Loader2, Phone, PhoneCall } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useElevenLabsAgent } from '@/hooks/useElevenLabsAgent';
import { useUsageTracking } from '@/hooks/useUsageTracking';

export const AiCallWidget = () => {
  const t = useTranslations('AiCalls');
  const { callHistory, isLoading, initiateTestCall } = useElevenLabsAgent();
  const { canUseFeature, trackUsage, getRemainingUsage } = useUsageTracking();
  const [testPhone, setTestPhone] = useState('');
  const [showTestDialog, setShowTestDialog] = useState(false);
  const [error, setError] = useState('');

  const handleTestCall = async () => {
    if (!testPhone) {
      return;
    }

    // Check if user can make AI calls
    if (!canUseFeature('aiCalls')) {
      // eslint-disable-next-line no-alert
      alert('You have reached your AI call limit for this month. Please upgrade your plan.');
      return;
    }

    try {
      setError('');
      await initiateTestCall(testPhone);

      // Track the usage - this will increment the counter
      trackUsage('aiCalls');

      setShowTestDialog(false);
      setTestPhone('');
      // eslint-disable-next-line no-alert
      alert(`Call initiated to ${testPhone}! Your AI receptionist will call that number shortly.`);
    } catch (error) {
      console.error('Test call failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to initiate call. Please try again.');
    }
  };

  // Use real call history from localStorage, fallback to empty array
  const recentCalls = callHistory;

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'booked': return 'text-green-600 bg-green-100';
      case 'info': return 'text-blue-600 bg-blue-100';
      case 'callback': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getOutcomeText = (outcome: string) => {
    switch (outcome) {
      case 'booked': return t('outcome_booked');
      case 'info': return t('outcome_info');
      case 'callback': return t('outcome_callback');
      default: return outcome;
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h ago`;
    }
  };

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <div className="mr-3 rounded-full bg-blue-100 p-2">
            <Phone className="size-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">{t('title')}</h2>
            <p className="text-sm text-muted-foreground">{t('description')}</p>
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setShowTestDialog(true);
            setError('');
          }}
          disabled={isLoading}
        >
          {isLoading
            ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Calling...
                </>
              )
            : (
                <>
                  <PhoneCall className="mr-2 size-4" />
                  {t('test_call')}
                </>
              )}
        </Button>
      </div>

      {/* Call Stats */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{recentCalls.length}</div>
          <div className="text-sm text-muted-foreground">{t('calls_today')}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {recentCalls.filter(call => call.outcome === 'booked').length}
          </div>
          <div className="text-sm text-muted-foreground">{t('bookings_made')}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {formatDuration(recentCalls.reduce((total, call) => total + call.duration, 0))}
          </div>
          <div className="text-sm text-muted-foreground">{t('total_time')}</div>
        </div>
      </div>

      {/* Recent Calls */}
      <div>
        <h3 className="mb-3 font-medium">{t('recent_calls')}</h3>
        <div className="space-y-3">
          {recentCalls.map(call => (
            <div key={call.id} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
              <div className="flex items-center">
                <div className="mr-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-sm font-medium text-white">
                    {call.customerName.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
                <div>
                  <div className="font-medium">{call.customerName}</div>
                  <div className="text-sm text-muted-foreground">{call.phoneNumber}</div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 size-3" />
                    {formatDuration(call.duration)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatTimeAgo(call.timestamp)}
                  </div>
                </div>
                <div className={`rounded-full px-2 py-1 text-xs font-medium ${getOutcomeColor(call.outcome)}`}>
                  {getOutcomeText(call.outcome)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {recentCalls.length === 0 && (
        <div className="py-8 text-center">
          <PhoneCall className="mx-auto mb-4 size-12 text-muted-foreground" />
          <h3 className="mb-2 font-medium">{t('no_calls_title')}</h3>
          <p className="mb-4 text-sm text-muted-foreground">{t('no_calls_description')}</p>
          <Button onClick={() => {
            setShowTestDialog(true);
            setError('');
          }}
          >
            {t('test_call')}
          </Button>
        </div>
      )}

      {/* Test Call Dialog */}
      {showTestDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-96 rounded-lg bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">Make a Test Call</h3>
            <p className="mb-2 text-sm text-muted-foreground">
              Enter any phone number and your AI receptionist will call that number to demonstrate how it handles customer calls.
            </p>
            <p className="mb-4 text-xs text-blue-600">
              Remaining AI calls this month:
              {' '}
              {getRemainingUsage('aiCalls')}
            </p>
            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}
            <Input
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={testPhone}
              onChange={e => setTestPhone(e.target.value)}
              className="mb-4"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleTestCall}
                disabled={!testPhone || isLoading}
                className="flex-1"
              >
                {isLoading
                  ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Starting Call...
                      </>
                    )
                  : (
                      <>
                        <PhoneCall className="mr-2 size-4" />
                        Start Test Call
                      </>
                    )}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowTestDialog(false);
                  setError('');
                }}
                disabled={isLoading}
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
