// src/app/(main)/page.tsx
'use client';

import { useRecentActivity } from '@/hooks/useRecentActivity';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const { activities, isLoading, isError } = useRecentActivity();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString([], {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const renderContent = () => {
    if (isLoading) {
      // Simple loading skeleton
      return (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-700/50 p-4 rounded-lg animate-pulse">
              <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-600 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      );
    }

    if (isError) {
      return (
        <div className="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-lg">
          <p className="font-bold">Error Fetching Activity</p>
          <p>Could not load recent activity. The API might be down.</p>
        </div>
      );
    }

    if (!activities || activities.length === 0) {
      return (
        <div className="bg-gray-800/60 text-center p-8 rounded-lg">
          <p className="text-gray-400">No recent activity found.</p>
          <p className="text-sm text-gray-500 mt-2">
            Create a new prompt to get started.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {activities.map((activity) => (
          <Link href={`/prompts/${activity.promptId}`} key={activity.id} className="block bg-gray-800 hover:bg-gray-700/60 p-4 rounded-lg border border-gray-700 transition-colors">
            <div className="flex justify-between items-center">
              <p className="font-semibold text-blue-400">{activity.promptName}</p>
              <span className="text-xs text-gray-500">{formatDate(activity.created_at)}</span>
            </div>
            <p className="text-sm text-gray-300 mt-1">
              <span className="font-bold">v{activity.version}:</span> {activity.commit_message || 'Initial version'}
            </p>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">
        Welcome back, {user?.displayName || 'User'}!
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Main content area, more components will go here */}
        </div>
        <div className="lg:col-span-1">
          <h2 className="text-xl font-semibold mb-3">Recent Activity</h2>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}