'use client';

import { useState } from 'react';

import { useLocalStorage } from './useLocalStorage';

type CallRecord = {
  id: string;
  customerName: string;
  phoneNumber: string;
  duration: number;
  outcome: 'booked' | 'info' | 'callback';
  timestamp: Date;
  agentId: string;
  transcript?: string;
};

type AgentConfig = {
  agentId: string;
  businessName: string;
  services: string[];
  businessHours: string;
  phoneNumber: string;
};

export const useElevenLabsAgent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [callHistory, setCallHistory] = useLocalStorage<CallRecord[]>('ai-call-history', []);
  const [agentConfig, setAgentConfig] = useLocalStorage<AgentConfig | null>('agent-config', null);

  const initiateTestCall = async (testPhoneNumber: string) => {
    setIsLoading(true);

    try {
      // Use your real agent ID or create dynamic ones per customer
      const currentAgentId = agentConfig?.agentId || '6RhauZbiAbIIXKby1Idp';

      // Call real ElevenLabs API through our backend
      const response = await fetch('/api/elevenlabs/conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: testPhoneNumber,
          agentId: currentAgentId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to initiate call');
      }

      const conversationData = await response.json();

      // For now, simulate the call result since we need phone integration
      // In production, this would come from ElevenLabs webhooks
      const mockCallResult = await simulateCall(currentAgentId, testPhoneNumber);

      // Add to call history with real conversation ID
      const newCall: CallRecord = {
        id: conversationData.conversationId || Math.random().toString(36).substr(2, 9),
        customerName: 'Test Customer',
        phoneNumber: testPhoneNumber,
        duration: mockCallResult?.duration || 60,
        outcome: mockCallResult?.outcome || 'info',
        timestamp: new Date(),
        agentId: currentAgentId,
        transcript: mockCallResult?.transcript || 'Test call completed successfully',
      };

      setCallHistory(prev => [newCall, ...prev.slice(0, 9)]); // Keep last 10 calls

      return newCall;
    } catch (error) {
      console.error('Test call failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const createBusinessAgent = async (businessData: {
    businessName: string;
    services: string[];
    businessHours: string;
    phoneNumber: string;
  }) => {
    setIsLoading(true);

    try {
      // In real implementation, this would call ElevenLabs API to create new agent
      // For now, simulate agent creation
      const newAgentId = `agent_${Math.random().toString(36).substr(2, 9)}`;

      const newAgentConfig: AgentConfig = {
        agentId: newAgentId,
        ...businessData,
      };

      setAgentConfig(newAgentConfig);

      return newAgentConfig;
    } catch (error) {
      console.error('Agent creation failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    callHistory,
    agentConfig,
    isLoading,
    initiateTestCall,
    createBusinessAgent,
  };
};

// Simulate ElevenLabs call for demo purposes
async function simulateCall(_agentId: string, _phoneNumber: string) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  const outcomes: Array<{ outcome: 'booked' | 'info' | 'callback'; duration: number; transcript: string }> = [
    {
      outcome: 'booked',
      duration: 180,
      transcript: 'Customer called to book a haircut appointment. Successfully scheduled for Tuesday at 2 PM.',
    },
    {
      outcome: 'info',
      duration: 95,
      transcript: 'Customer inquired about pricing and services. Provided information about our packages.',
    },
    {
      outcome: 'callback',
      duration: 142,
      transcript: 'Customer wants to discuss custom package. Scheduled callback for tomorrow.',
    },
  ];

  return outcomes[Math.floor(Math.random() * outcomes.length)];
}
