import { Route, Routes, Navigate } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import AuthPage from "../pages/AuthPage";
import Dashboard from "../pages/Dashboard";
import BoardPage from "../pages/BoardPage";
import TaskPage from "../pages/TasksPage";
import Layout from "../pages/Layout";
import ProtectedRoute from "../components/ProtectedRoute";
import AllBoardsPage from "../pages/AllBoardsPage";

const AppRoutes = () => {
  const isAuthenticated = Boolean(localStorage.getItem("token"));

  return (
    <Routes>
      {/* Public Routes - Bounces user to dashboard if already logged in */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/home/dashboard" replace />
          ) : (
            <LandingPage />
          )
        }
      />
      <Route
        path="/auth"
        element={
          isAuthenticated ? (
            <Navigate to="/home/dashboard" replace />
          ) : (
            <AuthPage />
          )
        }
      />

      {/* 🔒 Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="boards/:workspaceId" element={<BoardPage />} />

          <Route
            path="/home/workspaces/:workspaceId/boards"
            element={<AllBoardsPage />}
          />

          <Route path="boards/:boardId/tasks" element={<TaskPage />} />
        </Route>
      </Route>

      {/* Wildcard Fallback */}
      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
};

export default AppRoutes;
