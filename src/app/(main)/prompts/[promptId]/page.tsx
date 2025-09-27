// src/app/(main)/prompts/[promptId]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { usePrompt } from '@/hooks/usePrompt';
import { usePromptVersions } from '@/hooks/usePromptVersions';
import { useState, useEffect } from 'react';
import { PromptVersion } from '@/types';
import Modal from '@/components/ui/Modal'; // Import Modal
import NewVersionForm from '@/components/features/prompts/NewVersionForm'; // Import Form

export default function PromptDetailPage() {
  const params = useParams();
  const promptId = params.promptId as string;

  const { prompt, isLoading: isPromptLoading, isError: isPromptError } = usePrompt(promptId);
  // Get the mutate function from our updated hook
  const { versions, isLoading: areVersionsLoading, isError: areVersionsError, mutateVersions } = usePromptVersions(promptId);

  const [selectedVersion, setSelectedVersion] = useState<PromptVersion | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for the modal

  useEffect(() => {
    // This logic ensures that if the selection hasn't been made (e.g., on first load or after a new version is created),
    // the latest version is automatically selected.
    if (versions && versions.length > 0) {
      if (!selectedVersion) {
        const latestVersion = versions.reduce((latest, current) => 
          current.version_number > latest.version_number ? current : latest
        );
        setSelectedVersion(latestVersion);
      }
    }
  }, [versions, selectedVersion]);

  // Handler for when the new version form succeeds
  const handleNewVersionSuccess = () => {
    mutateVersions(); // Re-fetch the version list to include the new version
    setIsModalOpen(false); // Close the modal
    setSelectedVersion(null); // Reset selection so the useEffect block will pick the new latest version
  };

  if (isPromptLoading) return <div>Loading prompt details...</div>;
  if (isPromptError) return <div className="text-red-500">Error loading prompt.</div>;
  if (!prompt) return <div>Prompt not found.</div>;

  const formatDate = (dateString: string) => new Date(dateString).toLocaleString();

  return (
    <div>
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">{prompt.name}</h1>
        <p className="text-gray-400 mt-2">{prompt.task_description}</p>
        <p className="text-xs text-gray-500 mt-2">By {prompt.owner.name} &middot; Created on {formatDate(prompt.created_at)}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Panel: Selected Prompt and Execution */}
        <div className="lg:col-span-2 bg-gray-800/50 p-6 rounded-lg border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">
            {selectedVersion ? `Version ${selectedVersion.version_number}` : 'Select a Version'}
          </h2>
          <div className="bg-gray-900 p-4 rounded-md min-h-[300px] text-gray-200 whitespace-pre-wrap font-mono">
            {selectedVersion?.prompt_text}
          </div>
          {/* We will build out the execution UI here later */}
        </div>

        {/* Right Panel: Version History (Updated) */}
        <div className="lg:col-span-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Version History</h2>
            {/* Button now opens the modal */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded-md"
            >
              New Version
            </button>
          </div>
          <div className="space-y-3">
            {/* Version list rendering is the same */}
            {areVersionsLoading && <p>Loading versions...</p>}
            {areVersionsError && <p className="text-red-500">Failed to load versions.</p>}
            {versions?.sort((a,b) => b.version_number - a.version_number).map(version => (
              <div
                key={version.id}
                onClick={() => setSelectedVersion(version)}
                className={`p-3 rounded-md border cursor-pointer transition-colors ${selectedVersion?.id === version.id ? 'bg-blue-900/50 border-blue-500' : 'bg-gray-800 border-gray-700 hover:bg-gray-700'}`}
              >
                <div className="flex justify-between items-center">
                  <p className="font-bold">Version {version.version_number}</p>
                  <p className="text-xs text-gray-500">{formatDate(version.created_at)}</p>
                </div>
                <p className="text-sm text-gray-400 mt-1 italic">
                  {version.commit_message || "Initial version."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal is now rendered here */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Version">
        <NewVersionForm promptId={promptId} onSuccess={handleNewVersionSuccess} />
      </Modal>
    </div>
  );
}