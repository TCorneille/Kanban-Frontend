import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MembersCard from "../components/MembersCard";
import ActivityCard from "../components/ActivityCard";
import TasksCard from "../components/TasksCard";
import {
  useGetBoardsQuery,
  useCreateBoardMutation,
} from "../app/api/board";

function BoardPage() {
  const { workspaceId = "" } = useParams<{ workspaceId?: string }>();
  const navigate = useNavigate();
  const [boardTitle, setBoardTitle] = useState("");

  // Fetch boards using workspaceId
  const {
    data: boardsResponse,
    isLoading: isLoadingBoards,
    isError: isGetError,
  } = useGetBoardsQuery(workspaceId, {
    skip: !workspaceId, // Avoid querying without a valid workspaceId
  });

  // Board creation mutation
  const [createBoard, { isLoading: isCreating }] = useCreateBoardMutation();

  const handleAddBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!boardTitle.trim() || !workspaceId) return;

    try {
      await createBoard({
        workspaceId,
        title: boardTitle.trim(),
      }).unwrap();
      setBoardTitle("");
    } catch (err) {
      console.error("Failed to create board:", err);
    }
  };

  const boards = boardsResponse?.data?.boards || [];

  return (
    <>
      {/* Header & Add Board Form */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-12 gap-4 sm:gap-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {workspaceId ? "Workspace Boards" : "All Boards"}
        </h1>

        <form
          onSubmit={handleAddBoard}
          className="flex items-center gap-3 w-full sm:w-auto"
        >
          <input
            type="text"
            value={boardTitle}
            onChange={(e) => setBoardTitle(e.target.value)}
            placeholder="Enter board name..."
            className="w-full sm:w-64 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 shadow-sm"
          />
          <button
            type="submit"
            disabled={!boardTitle.trim() || isCreating || !workspaceId}
            className="whitespace-nowrap bg-primary px-5 py-2 rounded-xl text-gray-900 font-medium hover:opacity-90 active:scale-[0.98] transition-all duration-200 shadow-sm disabled:opacity-50"
          >
            {isCreating ? "Adding..." : "Add Board"}
          </button>
        </form>
      </div>

      {/* Boards List / Grid Section */}
      <div className="mt-8">
        {isLoadingBoards && (
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Loading boards...
          </p>
        )}

        {isGetError && (
          <p className="text-red-500 text-sm">
            Failed to load boards for this workspace.
          </p>
        )}

        {!isLoadingBoards && !isGetError && boards.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No boards found in this workspace. Create one above to get started!
          </p>
        )}

        {!isLoadingBoards && boards.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {boards.map((board) => (
              <div
                key={board._id}
                onClick={() =>
                  navigate(`/home/boards/${board._id}/tasks`)
                }
                className="p-5  dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-md cursor-pointer transition-all border-l-4 border-l-primary"
              >
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2 truncate">
                  {board.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {board.columns?.length || 0} Columns
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Workspace Secondary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 mt-12 gap-8 items-stretch">
        <MembersCard workspaceId={workspaceId} />
        <ActivityCard />
      </div>

      <div className="mt-12">
        <TasksCard />
      </div>
    </>
  );
}

export default BoardPage;