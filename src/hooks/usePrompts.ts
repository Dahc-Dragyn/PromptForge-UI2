// src/hooks/usePrompts.ts
'use client';

import useSWR from 'swr';
import apiClient from '@/lib/apiClient';
import { Prompt } from '@/types';
import { useAuth } from '@/context/AuthContext';

const fetcher = (url: string) => apiClient.get(url).json<Prompt[]>();

export function usePrompts() {
  const { user, loading: isAuthLoading } = useAuth();

  // FIX: Add the trailing slash to match the backend's strict requirement.
  const apiKey = user && !isAuthLoading ? 'prompts/' : null;

  const { data, error, isLoading, mutate } = useSWR(apiKey, fetcher);

  return {
    prompts: data,
    isLoading: isLoading && !isAuthLoading,
    isError: error,
    mutatePrompts: mutate,
  };
}