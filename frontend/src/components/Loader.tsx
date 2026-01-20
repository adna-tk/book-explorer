import React from "react";
import { Loader as LoaderIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";

interface LoaderProps {
    size?: number;           
    text?: string;
    fullScreen?: boolean;
    className?: string;
    spinOpacity?: boolean;   
}

export const Loader: React.FC<LoaderProps> = ({
    size = 48,
    text,
    fullScreen = false,
    className,
    spinOpacity = false,
}) => {
    const containerClasses = twMerge(
        "flex flex-col items-center justify-center",
        fullScreen ? "fixed inset-0 bg-primary/50 z-50" : "py-10",
        className
    );

    const iconClasses = twMerge(
        "animate-spin",
        spinOpacity ? "opacity-50 hover:opacity-100 transition-opacity duration-500" : ""
    );

    return (
        <div className={containerClasses}>
            <LoaderIcon className={iconClasses} size={size} color="var(--color-accent)" />
            {text && <span className="mt-2 text-muted">{text}</span>}
        </div>
    );
};
