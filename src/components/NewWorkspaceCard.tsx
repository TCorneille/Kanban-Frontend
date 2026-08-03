import React, { useState } from 'react';
import { useCreateWorkspaceMutation } from '../app/api/workspace';

export function NewWorkspaceCard() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // RTK Query Mutation Hook
  const [createWorkspace, { isLoading }] = useCreateWorkspaceMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await createWorkspace({ name, description }).unwrap();
      setName('');
      setDescription('');
    } catch (err) {
      console.error('Failed to create workspace:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-[#13161c] border border-[#1e232d] rounded-2xl w-[400px] max-w-sm">
      <h3 className="text-xl font-semibold text-white mb-4">Create Workspace</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-slate-400 mb-1">Workspace Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Engineering Team"
            required
            className="w-full px-3 py-2 bg-[#1a1f2c] border border-[#2d3446] rounded-lg text-white text-sm focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is this workspace for?"
            rows={3}
            className="w-full px-3 py-2 bg-[#1a1f2c] border border-[#2d3446] rounded-lg text-white text-sm focus:outline-none focus:border-amber-500"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-semibold rounded-lg text-sm transition-colors"
        >
          {isLoading ? 'Creating...' : 'Create Workspace'}
        </button>
      </div>
    </form>
  );
}

export default NewWorkspaceCard;