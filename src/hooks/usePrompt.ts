// src/hooks/usePrompt.ts
'use client';

import useSWR from 'swr';
import apiClient from '@/lib/apiClient';
import { Prompt } from '@/types';
import { useAuth } from '@/context/AuthContext';

const fetcher = (url: string) => apiClient.get(url).json<Prompt>();

export function usePrompt(promptId?: string) {
  const { user, loading: isAuthLoading } = useAuth();

  // FIX: Add a trailing slash after the promptId
  const apiKey = user && !isAuthLoading && promptId ? `prompts/${promptId}/` : null;

  const { data, error, isLoading } = useSWR(apiKey, fetcher);

  return {
    prompt: data,
    isLoading,
    isError: error,
  };
}