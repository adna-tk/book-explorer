import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    variant?: "primary" | "secondary";
    label?: string;
    icon?: React.ReactNode;
    error?: string;
}

export const Input: React.FC<InputProps> = ({
    variant = "primary",
    icon,
    className,
    label,
    type = "text",
    error,
    ...props
}) => {
    const isPassword = type === "password";
    const [showPassword, setShowPassword] = useState(false);

    const inputType =
        isPassword ? (showPassword ? "text" : "password") : type;


    const baseClasses =
        "w-full rounded-lg border px-4 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-accent/40";

    const variants = {
        primary:
            "bg-[var(--color-card)] text-[var(--color-secondary)] border-[var(--color-secondary)]/20 placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)]",
        secondary:
            "bg-[var(--color-accent)] text-white border-[var(--color-accent)] placeholder:text-white/70",
    };

    const errorClasses = error
        ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/40"
        : "";

    return (
        <div className={twMerge("relative w-full", className)}>
            {icon && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]">
                    {icon}
                </span>
            )}
            {label && <p className="mb-1 text-muted text-sm">{label}</p>}

            <input
                type={inputType}
                className={twMerge(
                    baseClasses,
                    variants[variant],
                    icon && "pl-10",
                    isPassword && "pr-10",
                    errorClasses
                )}
                {...props}
            />

            {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
            )}

            {isPassword && (
                <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-2/3 -translate-y-1/2 text-[var(--color-primary)] dark:text-[var(--color-secondary)] hover:text-[var(--color-accent)]"
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            )}
        </div>
    );
};
