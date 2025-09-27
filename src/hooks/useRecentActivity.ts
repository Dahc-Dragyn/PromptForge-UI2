// src/hooks/useRecentActivity.ts
'use client';

import useSWR from 'swr';
import apiClient from '@/lib/apiClient';
import { RecentActivity } from '@/types';
import { useAuth } from '@/context/AuthContext';

const fetcher = async (url: string) => {
  try {
    const data = await apiClient.get(url).json<RecentActivity[]>();
    return data;
  } catch (error) {
    console.error("SWR Fetcher Error:", error);
    throw error;
  }
};

export function useRecentActivity(isAuthLoading: boolean) {
  // FIX: Add a trailing slash to match the backend's URL structure.
  const apiKey = isAuthLoading ? null : 'metrics/activity/recent/';

  const { data, error, isLoading } = useSWR(apiKey, fetcher, {
    refreshInterval: 30000,
  });

  return {
    activities: data,
    isLoading: isLoading && !isAuthLoading,
    isError: error,
  };
}