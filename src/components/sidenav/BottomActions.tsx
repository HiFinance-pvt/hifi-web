import React from "react";

// Minimal SVG Icons
const SettingsIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
  </svg>
);

const LogOutIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
  </svg>
);

// Action Item Component
export const ActionItem = ({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType;
  label: string;
}) => (
  <div className="flex items-center gap-3 p-2 text-sm text-[var(--foreground-muted)] 
                 hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] 
                 rounded-lg cursor-pointer transition-colors">
    <Icon />
    {label}
  </div>
);

// Bottom Actions Component
const BottomActions = () => {
  const actions = [
    { icon: SettingsIcon, label: "Settings" },
    { icon: LogOutIcon, label: "Sign Out" },
  ];

  return (
    <div className="border-t border-[var(--surface-border)] p-4 space-y-1">
      {actions.map((action, index) => (
        <ActionItem key={index} icon={action.icon} label={action.label} />
      ))}
    </div>
  );
};

export default BottomActions;
