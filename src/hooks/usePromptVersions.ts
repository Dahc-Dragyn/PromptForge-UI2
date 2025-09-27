// src/hooks/usePromptVersions.ts
'use client';

import useSWR from 'swr';
import apiClient from '@/lib/apiClient';
import { PromptVersion } from '@/types';
import { useAuth } from '@/context/AuthContext';

const fetcher = (url: string) => apiClient.get(url).json<PromptVersion[]>();

export function usePromptVersions(promptId?: string) {
  const { user, loading: isAuthLoading } = useAuth();

  // FIX: Add a trailing slash to the end of the URL
  const apiKey = user && !isAuthLoading && promptId ? `prompts/${promptId}/versions/` : null;

  const { data, error, isLoading, mutate } = useSWR(apiKey, fetcher);

  return {
    versions: data,
    isLoading,
    isError: error,
    mutateVersions: mutate,
  };
}