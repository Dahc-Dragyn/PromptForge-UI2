// src/app/(main)/prompts/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import apiClient from '@/lib/apiClient';
import { usePrompts } from '@/hooks/usePrompts';

export default function NewPromptPage() {
  const router = useRouter();
  const { mutatePrompts } = usePrompts();

  const [name, setName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [initialPromptText, setInitialPromptText] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        name,
        task_description: taskDescription,
        initial_prompt_text: initialPromptText,
      };

      await apiClient.post('prompts', { json: payload });

      // Trigger a re-fetch of the prompts list on the library page
      await mutatePrompts();

      // Redirect to the library page on success
      router.push('/prompts');

    } catch (err) {
      setError('Failed to create prompt. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create New Prompt</h1>
        <p className="text-gray-400">Start by defining the core details of your new prompt.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300">
            Prompt Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Socratic Tutor Persona"
          />
        </div>

        <div>
          <label htmlFor="task_description" className="block text-sm font-medium text-gray-300">
            Task Description
          </label>
          <textarea
            id="task_description"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            required
            rows={3}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe what this prompt is intended to do."
          />
        </div>

        <div>
          <label htmlFor="initial_prompt_text" className="block text-sm font-medium text-gray-300">
            Initial Prompt Text (Version 1)
          </label>
          <textarea
            id="initial_prompt_text"
            value={initialPromptText}
            onChange={(e) => setInitialPromptText(e.target.value)}
            required
            rows={6}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono"
            placeholder="Enter the first version of your prompt text here..."
          />
        </div>
        
        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex justify-end gap-4">
          <Link 
            href="/prompts"
            className="py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 hover:bg-gray-700"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating...' : 'Create Prompt'}
          </button>
        </div>
      </form>
    </div>
  );
}