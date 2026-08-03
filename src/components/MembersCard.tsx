import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  useGetWorkspaceByIdQuery,
  useAddMemberMutation,
  useRemoveMemberMutation,
} from '../app/api/workspace';

interface MembersCardProps {
  workspaceId?: string;
}

export const MembersCard: React.FC<MembersCardProps> = ({ workspaceId: propWorkspaceId }) => {
  const params = useParams<{ workspaceId: string }>();
  // Fall back to props if available, otherwise read from React Router URL params
  const workspaceId = propWorkspaceId || params.workspaceId || '';

  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Skip query execution if workspaceId isn't loaded yet
  const { data: workspace, isLoading, isError } = useGetWorkspaceByIdQuery(workspaceId, {
    skip: !workspaceId,
  });

  const [addMember, { isLoading: isAdding }] = useAddMemberMutation();
  const [removeMember] = useRemoveMemberMutation();

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !workspaceId) return;

    setErrorMessage(null);

    try {
      // Pass both email AND role in the payload
      await addMember({ 
        workspaceId, 
        email: email.trim(), 
        role: 'member' 
      }).unwrap();

      setEmail('');
    } catch (err: any) {
      console.error('Failed to add member:', err);
      // Display user-friendly error message from response or fallback
      setErrorMessage(
        err?.data?.message || err?.data?.error || 'Failed to add member. Make sure the user exists.'
      );
    }
  };

  const handleRemove = async (userId: string) => {
    if (!workspaceId) return;
    try {
      await removeMember({ workspaceId, userId }).unwrap();
    } catch (err) {
      console.error('Failed to remove member:', err);
    }
  };

  if (!workspaceId) {
    return (
      <div className="w-full max-w-lg rounded-2xl bg-[#13161c] border border-[#1e232d] p-6 text-slate-400">
        No active workspace selected.
      </div>
    );
  }

  const members = workspace?.members || [];

  return (
    <div className="w-full max-w-lg rounded-2xl bg-[#13161c] border border-[#1e232d] p-6 shadow-sm min-h-[220px]">
      <h2 className="text-xl font-bold text-white mb-5 tracking-tight">Members</h2>

      <form onSubmit={handleAdd} className="flex flex-col gap-2 mb-6">
        <div className="flex items-center gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            placeholder="teammate@email.com"
            disabled={isAdding}
            className="flex-1 px-4 py-2.5 rounded-xl bg-transparent border border-[#232834] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors duration-150 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isAdding || !email.trim()}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-slate-950 font-semibold text-sm transition-all duration-150 cursor-pointer disabled:opacity-50"
          >
            {isAdding ? 'Adding...' : 'Add'}
          </button>
        </div>

        {/* Display inline API error when member addition fails */}
        {errorMessage && (
          <p className="text-xs text-red-400 mt-1">{errorMessage}</p>
        )}
      </form>

      {isLoading ? (
        <p className="text-sm text-slate-400">Loading members...</p>
      ) : isError ? (
        <p className="text-sm text-red-400">Failed to load members.</p>
      ) : members.length === 0 ? (
        <p className="text-sm text-slate-500">No members found.</p>
      ) : (
        <div className="space-y-3">
          {members.map((m) => {
            const userId = typeof m.user === 'object' ? m.user._id : m.user;
            const userName = typeof m.user === 'object' ? (m.user.name || m.user.email) : m.user;

            return (
              <div key={userId} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-medium text-white truncate">{userName}</span>
                  <span className="px-2.5 py-0.5 text-xs font-semibold text-slate-300 bg-[#1e232d] rounded-full border border-[#2a303d]">
                    {m.role}
                  </span>
                </div>
                {m.role !== 'owner' && (
                  <button
                    onClick={() => handleRemove(userId)}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MembersCard;