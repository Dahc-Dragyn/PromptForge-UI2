// src/components/features/prompts/NewVersionForm.tsx
'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import apiClient from '@/lib/apiClient';
import { PromptVersion } from '@/types';
import { useState } from 'react';

// Define the shape of the form data
interface FormInputs {
  prompt_text: string;
  commit_message: string;
}

// Define the component props
interface NewVersionFormProps {
  promptId: string;
  onSuccess: () => void;
}

export default function NewVersionForm({ promptId, onSuccess }: NewVersionFormProps) {
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset,
  } = useForm<FormInputs>();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // The endpoint for creating a new version is /prompts/{promptId}/versions
      await apiClient.post(`prompts/${promptId}/versions`, {
        json: {
          prompt_text: data.prompt_text,
          commit_message: data.commit_message,
        },
      }).json<PromptVersion>(); // Expect the created version back
      
      onSuccess(); // Call the success handler from the parent page (to mutate and close modal)
      reset(); // Optionally reset the form fields

    } catch (err: any) {
      console.error('Failed to create new version:', err);
      // Display a user-friendly error message
      const errorMessage = err.response?.status === 400 
        ? "Invalid data. Please ensure the prompt text is not empty." 
        : "An unexpected error occurred while saving the version.";
      setError(errorMessage);

    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-900/50 text-red-300 rounded border border-red-700">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="prompt_text" className="block text-sm font-medium text-gray-300 mb-1">
          New Prompt Text
        </label>
        <textarea
          id="prompt_text"
          rows={6}
          {...register('prompt_text', { required: 'Prompt text is required' })}
          className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter the complete new version of the prompt..."
          disabled={isSubmitting}
        />
        {errors.prompt_text && (
          <p className="mt-1 text-sm text-red-400">{errors.prompt_text.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="commit_message" className="block text-sm font-medium text-gray-300 mb-1">
          Commit Message (Summary of Changes)
        </label>
        <input
          type="text"
          id="commit_message"
          {...register('commit_message')}
          className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g., Added tone constraint and fixed variable name."
          disabled={isSubmitting}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Creating...' : 'Save New Version'}
        </button>
      </div>
    </form>
  );
}