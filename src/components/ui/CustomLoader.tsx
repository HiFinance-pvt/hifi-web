import React from "react";

interface CustomLoaderProps {
    message?: string;
    size?: "sm" | "md" | "lg";
    variant?: "default" | "session" | "message";
}

export const CustomLoader: React.FC<CustomLoaderProps> = ({
    message = "Loading...",
    size = "md",
    variant = "default"
}) => {
    const sizeClasses = {
        sm: "w-6 h-6",
        md: "w-8 h-8",
        lg: "w-10 h-10"
    };

    return (
        <div className={`flex flex-col items-center justify-center ${variant === "session" ? "p-6" : ""}`}>
            <div className="relative">
                {/* Main spinner */}
                <div className={`${sizeClasses[size]} border-2 border-[var(--surface-border)] border-t-[var(--brand-primary)] rounded-full animate-spin`} />
            </div>

            {message && (
                <p className="mt-3 text-sm text-[var(--foreground-muted)] font-medium">
                    {message}
                </p>
            )}

            {/* Dots for session variant */}
            {variant === "session" && (
                <div className="mt-4 flex gap-1">
                    <div className="w-1.5 h-1.5 bg-[var(--brand-primary)] rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-[var(--brand-primary)] rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-[var(--brand-primary)] rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                </div>
            )}
        </div>
    );
};

// Session creation loader
export const SessionCreationLoader: React.FC = () => (
    <div className="fixed inset-0 bg-[var(--background)]/90 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-[var(--surface)] border border-[var(--surface-border)] rounded-2xl p-8">
            <CustomLoader
                message="Creating new session..."
                size="lg"
                variant="session"
            />
        </div>
    </div>
);

// Inline message loader
export const MessageLoader: React.FC = () => (
    <CustomLoader
        message="Sending..."
        size="sm"
        variant="message"
    />
);
