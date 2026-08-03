import { BsLayers } from "react-icons/bs";
import AuthCard from "../components/AuthCard";

function AuthPage() {
  return (
    <main className="min-h-dvh flex flex-col justify-between sm:justify-center items-center px-4 sm:px-6 py-6 sm:py-12">
      {/* Brand Header */}
      <div className="flex items-center gap-2 mt-4 sm:mt-0 mb-4 sm:mb-6">
        <BsLayers className="text-primary rounded-md p-1.5 w-8 h-8 sm:w-9 sm:h-9" />
        <h1 className="font-bold text-lg sm:text-xl text-primary">Project Flow</h1>
      </div>

      <div className="w-full max-w-md my-auto sm:my-0">
        <AuthCard />
      </div>

      <div className="h-4 sm:hidden" aria-hidden="true" />
    </main>
  );
}

export default AuthPage;