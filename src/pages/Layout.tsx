import type { MouseEvent } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { BsLayers } from "react-icons/bs";
import { useLogoutMutation } from "../app/api/auth";

function Layout() {
  const [logout, { isLoading }] = useLogoutMutation();
  const navigate = useNavigate();

  const handleLogout = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await logout().unwrap();
      // Optional: Clear tokens or state here if not handled automatically in RTK Query
      navigate("/auth");
    } catch (err) {
      console.error("Failed to log out:", err);
    }
  };

  return (
    <>
      <Header
        hasBorder={true}
        brandIcon={<BsLayers className="text-primary rounded-md p-2 w-9 h-9" />}
        actions={[
          {
            label: "Dashboard",
            to: "/dashboard",
            className:
              "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl text-gray-50 hover:text-gray-900 transition-colors",
          },
          {
            label: "Workspaces",
            to: "/workspaces",
            className:
              "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl text-gray-50 hover:text-gray-900 transition-colors",
          },
          {
            label: isLoading ? "Signing Out..." : "Sign Out",
            onClick: handleLogout,
            className:
              "flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary rounded-xl text-gray-700 hover:text-gray-900 transition-colors disabled:opacity-50",
          },
        ]}
      />

      <main className="flex flex-col pt-24 max-w-7xl mx-auto px-6">
        <Outlet />
      </main>
    </>
  );
}

export default Layout;