import React from "react";
import { FaPlus } from "react-icons/fa";
import { CgTrash } from "react-icons/cg";
import { useDeleteWorkspaceMutation } from "../app/api/workspace";
// import { Link } from "react-router-dom";

export interface WorkspaceCardProps {
  /** Unique workspace ID required for mutations */
  workspaceId: string;
  /** Workspace title */
  name: string;
  /** User's role inside the workspace */
  role?: "owner" | "admin" | "member" | string;
  /** Count of total boards inside this workspace */
  boardsCount?: number;
  /** Count of total members */
  membersCount?: number;
  /** Description or subtitle text */
  description?: string;
  /** Handlers for actions */
  onOpen?: () => void;
  onAddBoard?: () => void;
  onDeleteSuccess?: () => void;
}

export const WorkspaceCard: React.FC<WorkspaceCardProps> = ({
  workspaceId,
  name,
  role = "member",
  boardsCount = 0,
  membersCount = 1,
  description = "",
  onOpen,
  onAddBoard,
  onDeleteSuccess,
}) => {
  const [deleteWorkspace, { isLoading: isDeleting }] =
    useDeleteWorkspaceMutation();

  const isOwner = role === "owner";

  const handleDelete = async () => {
    if (!isOwner || isDeleting) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${name}"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      await deleteWorkspace(workspaceId).unwrap();
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    } catch (err) {
      console.error("Failed to delete workspace:", err);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl bg-[#13161c] border border-[#1e232d] p-5 shadow-sm text-white flex flex-col justify-between">
      <div>
        {/* Header Section: Title and Role Tag */}
        <div className="flex items-start justify-between gap-3 mb-1">
          <h3
            className="text-xl font-bold tracking-tight text-white truncate"
            title={name}
          >
            {name}
          </h3>
          <span className="px-3 py-1 text-xs font-semibold capitalize text-amber-500/90 bg-[#1e232d]/80 rounded-full border border-amber-500/10">
            {role}
          </span>
        </div>

        {/* Meta Info: Boards & Members */}
        <div className="text-xs text-slate-400 font-medium mb-4">
          {boardsCount} {boardsCount === 1 ? "board" : "boards"} ·{" "}
          {membersCount} {membersCount === 1 ? "member" : "members"}
        </div>

        {/* Description */}
        <p
          className="text-sm text-slate-400 font-normal mb-6 min-h-[1.25rem] line-clamp-2"
          title={description}
        >
          {description || "No description provided."}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#1e232d]/50">
        {/* Left Actions */}
        <div className="flex items-center gap-2">
          {/* Open Button */}
          {/* Open Button */}
          <button
            type="button"
            onClick={onOpen}
            className="px-4 py-2 text-sm font-semibold text-white bg-[#1e232d] hover:bg-[#282e3d] rounded-xl transition-colors duration-150 cursor-pointer"
          >
            Open
          </button>

          {/* + Board Button */}
          <button
            onClick={onAddBoard}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-white hover:bg-[#1e232d]/60 rounded-xl transition-colors duration-150 cursor-pointer"
          >
            <FaPlus className="w-3.5 h-3.5 text-slate-300" />
            <span>Board</span>
          </button>
        </div>

        {/* Right Action: Delete Button (Restricted to Owner) */}
        {isOwner && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-red-500 hover:bg-red-500/10 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors duration-150 cursor-pointer"
          >
            <CgTrash className="w-4 h-4" />
            <span>{isDeleting ? "Deleting..." : "Delete"}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default WorkspaceCard;
