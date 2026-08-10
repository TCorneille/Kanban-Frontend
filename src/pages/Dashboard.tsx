import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { DashboardStats } from "../components/DashboardStats";
import NewWorkspaceCard from "../components/NewWorkspaceCard";
import WorkspaceCard from "../components/WorkspaceCard";
import {
  useGetUserWorkspacesQuery,
  type IWorkspace,
} from "../app/api/workspace";

export function Dashboard() {
  const navigate = useNavigate();

  // Retrieve logged-in user ID from Redux auth slice
  const currentUserId = useSelector((state: any) => state.auth?.user?._id);

  // RTK Query hook call
  const queryResult = useGetUserWorkspacesQuery();
  const { data: response, isLoading, isError } = queryResult;

  // Direct array assignment
  const workspaces: IWorkspace[] = Array.isArray(response)
    ? response
    : (response as { data?: { workspaces?: IWorkspace[] } } | undefined)?.data
        ?.workspaces || [];

  const hasWorkspaces = workspaces.length > 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2 text-white">Dashboard</h1>
        <p className="text-lg text-slate-400">
          Welcome to your dashboard! Manage your workspaces, view your projects,
          and keep track of your team's progress.
        </p>
      </div>

      {/* Stats Summary Section */}
      <DashboardStats />

      {/* Main Workspace Section */}
      <div className="mt-12">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
          {/* Workspaces List / Grid Column */}
          <div className="flex-1 w-full">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Your Workspaces
            </h2>

            {/* 1. Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center p-12 bg-[#13161c] border border-[#1e232d] rounded-2xl">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
                <span className="ml-3 text-slate-400 text-sm">
                  Loading workspaces...
                </span>
              </div>
            )}

            {/* 2. Error State */}
            {isError && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-sm">
                Failed to load workspaces. Open DevTools Console (F12) to
                inspect the error payload.
              </div>
            )}

            {/* 3. Empty State */}
            {!isLoading && !isError && !hasWorkspaces && (
              <div className="p-8 bg-[#13161c] border border-[#1e232d] rounded-2xl text-center">
                <p className="text-lg text-slate-400">
                  No workspaces yet. Create a new workspace to get started!
                </p>
              </div>
            )}

            {/* 4. Active Workspaces Grid */}
            {!isLoading && !isError && hasWorkspaces && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {workspaces.map((workspace) => {
                  const ownerId =
                    typeof workspace.owner === "string"
                      ? workspace.owner
                      : workspace.owner?._id;

                  const targetUserId = currentUserId || ownerId;

                  const memberRecord = workspace.members?.find((m) => {
                    const memberUserId =
                      typeof m.user === "string" ? m.user : m.user?._id;
                    return memberUserId === targetUserId;
                  });

                  const userRole = memberRecord
                    ? memberRecord.role
                    : ownerId === targetUserId
                      ? "owner"
                      : "member";

                  return (
                    <WorkspaceCard
                      key={workspace._id}
                      workspaceId={workspace._id}
                      name={workspace.name}
                      description={workspace.description}
                      role={userRole}
                      boardsCount={0}
                      membersCount={workspace.members?.length || 1}
                      // Passing { replace: true } prevents adding an unnecessary history entry
                      onOpen={() =>
                        navigate(`/home/boards/${workspace._id}`, {
                          replace: true,
                        })
                      }
                      onAddBoard={() =>
                        navigate(`/home/boards/${workspace._id}`, {
                          replace: true,
                        })
                      }
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* New Workspace Form Column */}
          <div className="w-full lg:w-auto shrink-0">
            <NewWorkspaceCard />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
