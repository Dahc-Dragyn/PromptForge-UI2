// src/types/index.ts

export interface RecentActivity {
    id: string;
    promptId: string;
    promptName: string;
    version: number;
    commit_message: string;
    created_at: string; 
  }
  
  export interface PromptOwner {
    uid: string;
    name: string;
    email: string;
  }
  
  export interface Prompt {
    id: string;
    name: string;
    task_description: string;
    created_at: string;
    latest_version: number;
    owner: PromptOwner;
  }
  
  // --- ADD THIS NEW INTERFACE ---
  
  export interface PromptVersion {
    id: string;
    prompt_id: string;
    version_number: number;
    prompt_text: string;
    commit_message: string | null;
    created_at: string;
    author_uid: string;
  }