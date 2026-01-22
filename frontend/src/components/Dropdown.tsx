import React, { useState, useRef, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { ChevronDown } from "lucide-react";

interface DropdownProps {
    options: DropdownOption[];
    value?: string | number;
    onChange?: (value: string | number) => void;
    placeholder?: string;
    className?: string;
}

export const CustomDropdown: React.FC<DropdownProps> = ({
    options,
    value,
    onChange,
    placeholder = "Select...",
    className,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((o) => o.value === value);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (val: string | number) => {
        onChange?.(val);
        setIsOpen(false);
    };

    return (
        <div className={twMerge("relative w-full", className)} ref={ref}>
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="w-full rounded-lg border border-secondary/20 bg-card px-4 py-2 text-left text-sm text-secondary flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-accent/40"
            >
                {selectedOption?.label || placeholder}
                <ChevronDown size={16} className={`ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
                <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-secondary/20 bg-card shadow-lg">
                    {options.map((opt) => (
                        <li
                            key={opt.value}
                            onClick={() => handleSelect(opt.value)}
                            className="cursor-pointer px-4 py-2 text-sm text-secondary hover:bg-accent/10"
                        >
                            {opt.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
