import React from "react";

export const BookSkeleton: React.FC = () => {
  return (
    <div className="bg-card rounded-xl p-4 shadow-md animate-pulse">
      <div className="mb-4 h-48 w-full rounded-lg bg-secondary/20" />
      
      <div className="border-t border-secondary/20 pt-4">
        <div className="h-5 w-3/4 rounded bg-secondary/20 mb-2" />
        
        <div className="h-4 w-1/2 rounded bg-secondary/20 mb-3" />
        
        <div className="flex items-center justify-between">
          <div className="h-3 w-20 rounded bg-secondary/20" />
          <div className="h-3 w-24 rounded bg-secondary/20" />
        </div>
      </div>
    </div>
  );
};

export const BooksSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <BookSkeleton key={index} />
      ))}
    </>
  );
};
