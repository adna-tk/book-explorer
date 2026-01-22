import React from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary";
    icon?: React.ReactNode;
    iconPosition?: "left" | "right";
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = "primary",
    icon,
    iconPosition = "left",
    className,
    ...props
}) => {
    const baseClasses =
        "inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent/40";
    const variants = {
        primary: "bg-[var(--color-accent)] text-white hover:brightness-90",
        secondary: "bg-[var(--color-card)] text-[var(--color-secondary)] border border-[var(--color-secondary)]/20 hover:bg-[var(--color-secondary)]/5",
    };

    const content = (
        <>
            {icon && iconPosition === "left" && icon}
            {children && <span>{children}</span>}
            {icon && iconPosition === "right" && icon}
        </>
    );

    return (
        <button
            className={twMerge(baseClasses, variants[variant], className)}
            {...props}
        >
            {content}
        </button>
    );
};
