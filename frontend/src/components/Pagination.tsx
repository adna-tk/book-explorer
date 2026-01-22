import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./Button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-2 ${className}`}>
      <Button
        variant="secondary"
        icon={<ChevronLeft size={16} />}
        onClick={handlePrevious}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className="w-full sm:w-auto"
      >
        
      </Button>

      <div className="flex items-center gap-1 flex-wrap justify-center">
        {pageNumbers.map((page, index) => {
          if (page === "...") {
            return (
              <span key={`ellipsis-${index}`} className="px-2 text-muted">
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`min-w-[36px] sm:min-w-[40px] px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                isActive
                  ? "bg-accent text-white"
                  : "bg-card text-secondary hover:bg-secondary/20"
              }`}
              aria-label={`Go to page ${pageNum}`}
              aria-current={isActive ? "page" : undefined}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      <Button
        variant="secondary"
        icon={<ChevronRight size={16} />}
        iconPosition="right"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className="w-full sm:w-auto"
      >
        
      </Button>
    </div>
  );
};
