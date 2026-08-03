import React from "react";
import { Link } from "react-router-dom";

interface HeaderAction {
  label?: string;
  icon?: React.ReactNode;
  to?: string;
  onClick?: () => void;
  className?: string;
}

interface HeaderProps {
  brandIcon?: React.ReactNode;
  actions?: HeaderAction[];
  hasBorder?: boolean; // 👈 1. Added optional border prop
  className?: string; // 👈 Optional custom styling prop
}

const Header: React.FC<HeaderProps> = ({ brandIcon, actions, hasBorder = false, className = "" }) => {
  return (
    <div
      className={`w-full fixed top-0 left-0 right-0 z-30 ${
        hasBorder ? "border-b border-gray-600" : ""
      } ${className}`}
    >
      <header className="flex max-w-7xl mx-auto justify-between items-center py-4 px-6 bg-transparent">
        <button className="flex items-center gap-2 select-none">
          {brandIcon}
          <span className="font-bold text-xl text-primary">Project Flow</span>
        </button>

        <div className="flex items-center gap-4">
          {actions?.map((action, index) => {
            if (action.to) {
              return (
                <Link
                  key={index}
                  to={action.to}
                  onClick={action.onClick}
                  className={action.className}
                >
                  {action.icon}
                  {action.label && <span>{action.label}</span>}
                </Link>
              );
            }

            if (!action.label) {
              return <div key={index}>{action.icon}</div>;
            }

            return (
              <button
                key={index}
                onClick={action.onClick}
                className={action.className}
              >
                {action.icon}
                <span>{action.label}</span>
              </button>
            );
          })}
        </div>
      </header>
    </div>
  );
};

export default Header;