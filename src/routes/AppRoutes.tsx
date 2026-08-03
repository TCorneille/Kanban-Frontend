import { Route, Routes } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import AuthPage from "../pages/AuthPage";
import Dashboard from "../pages/Dashboard";
import BoardPage from "../pages/BoardPage";
import TaskPage from "../pages/TasksPage";
import Layout from "../pages/Layout";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />

      {/* Protected Routes sharing Layout */}
      <Route path="/home" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        
        {/* Base Boards page */}
        <Route path="boards" element={<BoardPage />} />
        
        {/* Board page filtered by a specific Workspace ID */}
        <Route path="boards/:workspaceId" element={<BoardPage />} />
        
        {/* Board Tasks Page - requires boardId */}
        <Route path="boards/:boardId/tasks" element={<TaskPage />} />

        {/* ❌ REMOVED: <Route path="tasks" element={<TaskPage />} /> */}
      </Route>

      {/* Wildcard Fallback */}
      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
};

export default AppRoutes;