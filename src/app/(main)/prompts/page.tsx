// src/app/(main)/prompts/page.tsx
'use client';

import { usePrompts } from '@/hooks/usePrompts';
import Link from 'next/link';

export default function PromptsPage() {
  const { prompts, isLoading, isError } = usePrompts();

  const renderPromptList = () => {
    if (isLoading) {
      // Simple loading skeleton
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-800 p-4 rounded-lg animate-pulse border border-gray-700">
              <div className="h-5 bg-gray-700 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2 mt-1"></div>
            </div>
          ))}
        </div>
      );
    }

    if (isError) {
      return (
        <div className="bg-red-900/50 text-red-200 p-4 rounded-lg text-center">
          <p>Failed to load prompts.</p>
        </div>
      );
    }

    if (!prompts || prompts.length === 0) {
      return (
        <div className="text-center text-gray-400 py-16">
          <h3 className="text-xl font-semibold">No Prompts Yet</h3>
          <p>Click "Create New Prompt" to get started.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prompts.map((prompt) => (
          <Link
            href={`/prompts/${prompt.id}`}
            key={prompt.id}
            className="block bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 hover:bg-gray-700/50 transition-all"
          >
            <h3 className="font-semibold text-lg text-white truncate">{prompt.name}</h3>
            <p className="text-gray-400 text-sm mt-2 line-clamp-2">{prompt.task_description}</p>
            <div className="text-xs text-gray-500 mt-4">
              <span>By {prompt.owner.name}</span> &middot; <span>v{prompt.latest_version}</span>
            </div>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Prompt Library</h1>
        <Link 
          href="/prompts/new" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
        >
          Create New Prompt
        </Link>
      </div>
      {renderPromptList()}
    </div>
  );
}