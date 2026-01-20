import React from "react";
import { twMerge } from "tailwind-merge";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    variant?: "primary" | "secondary";
    icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
    variant = "primary",
    icon,
    className,
    ...props
}) => {
    const baseClasses =
        "w-full rounded-lg border px-4 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-accent/40";

    const variants = {
        primary:
            "bg-[var(--color-card)] text-[var(--color-secondary)] border-[var(--color-secondary)]/20 placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)]",
        secondary:
            "bg-[var(--color-accent)] text-white placeholder:text-white/70 focus:border-[var(--color-accent)]",
    };

    return (
        <div className={twMerge("relative w-full", className)}>
            {icon && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-muted) color-primary">
                    {icon}
                </span>
            )}
            <input
                className={twMerge(
                    baseClasses,
                    variants[variant],
                    icon ? "pl-10" : ""
                )}
                {...props}
            />
        </div>
    );
};
