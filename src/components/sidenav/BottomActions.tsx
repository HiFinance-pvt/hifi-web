import React from "react";
import { Settings, LogOut } from "lucide-react";

// Individual Action Item Component
export const ActionItem = ({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<any>;
  label: string;
}) => (
  <div className="flex items-center gap-3 p-2 text-sm text-gray-400 hover:text-gray-300 hover:bg-gray-800 rounded-lg cursor-pointer transition-colors">
    <Icon className="h-4 w-4" />
    {label}
  </div>
);

// Bottom Actions Component
const BottomActions = () => {
  const actions = [
    { icon: Settings, label: "Settings" },
    { icon: LogOut, label: "Sign Out" },
  ];

  return (
    <div className="border-t border-gray-800 p-4 space-y-2">
      {actions.map((action, index) => (
        <ActionItem key={index} icon={action.icon} label={action.label} />
      ))}
    </div>
  );
};

export default BottomActions;
