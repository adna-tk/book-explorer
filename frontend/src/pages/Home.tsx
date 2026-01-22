import React, { useState, useEffect } from "react";
import { useBooks, useChoices, type PaginatedResponse } from "../hooks/useBooks";
import { Card } from "../components/Card";
import { useNavigate } from "react-router-dom";
import { BooksSkeleton } from "../components/BookSkeleton";
import { Input } from "../components/Input";
import { CustomDropdown } from "../components/Dropdown";
import { Pagination } from "../components/Pagination";

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { data: choices } = useChoices();

  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [bookType, setBookType] = useState("");
  const [ordering, setOrdering] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, genre, bookType, ordering]);

  const { data: booksData, isLoading, isError } = useBooks({
    search: search || undefined,
    genre: genre || undefined,
    book_type: bookType || undefined,
    ordering: ordering || undefined,
    page: currentPage,
  });

  const paginatedData = booksData as PaginatedResponse<Book> | undefined;
  const books = paginatedData?.results ?? [];
  const pagination = paginatedData ? {
    currentPage: paginatedData.current_page,
    totalPages: paginatedData.total_pages,
    pageSize: paginatedData.page_size,
    count: paginatedData.count,
  } : null;

  const handleBookClick = (id: number) => {
    navigate(`/book/${id}`);
  };

  if (isError) {
    return (
      <div className="mt-16 text-center text-light">
        Error loading books.
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="flex justify-between gap-x-4">
        <Input
          placeholder="Search books by title or author"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex gap-x-4 w-full">
          <CustomDropdown
            options={[{ value: '', label: 'All genres' }, ...(choices?.genres || [])]}
            value={genre}
            onChange={(v) => setGenre(String(v))}
            placeholder="Select genre"
          />

          <CustomDropdown
            options={[{ value: '', label: 'All book types' }, ...(choices?.book_types || [])]}
            value={bookType}
            onChange={(v) => setBookType(String(v))}
            placeholder="Select book type"
          />

          <CustomDropdown
            options={[
              { value: '', label: 'Default (Title)' },
              { value: 'published_year', label: 'Year: Oldest First' },
              { value: '-published_year', label: 'Year: Newest First' },
              { value: 'title', label: 'Title: A-Z' },
              { value: '-title', label: 'Title: Z-A' },
              { value: 'author', label: 'Author: A-Z' },
              { value: '-author', label: 'Author: Z-A' },
              { value: '-created_at', label: 'Newest Added' },
              { value: 'created_at', label: 'Oldest Added' },
            ]}
            value={ordering}
            onChange={(v) => setOrdering(String(v))}
            placeholder="Sort by"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {isLoading ? (
          <BooksSkeleton count={12} />
        ) : books && books.length > 0 ? (
          books.map((book: Book) => (
            <Card
              key={book.id}
              book={book}
              onClick={() => handleBookClick(book.id)}
            />
          ))
        ) : (
          <div className="col-span-full text-center text-muted py-10">
            No books found.
          </div>
        )}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={setCurrentPage}
          />
          <div className="mt-4 text-center text-sm text-muted">
            Showing {((pagination.currentPage - 1) * pagination.pageSize) + 1} to{" "}
            {Math.min(pagination.currentPage * pagination.pageSize, pagination.count)} (of{" "}
            {pagination.count} books)
          </div>
        </div>
      )}
    </div>
  );
};
