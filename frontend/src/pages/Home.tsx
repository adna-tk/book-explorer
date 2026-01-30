import React, { useState, useEffect, useMemo } from "react";
import { useBooks, useChoices } from "../hooks/useBooks";
import { Card } from "../components/Card";
import { useNavigate } from "react-router-dom";
import { BooksSkeleton } from "../components/BookSkeleton";
import { Input } from "../components/Input";
import { CustomDropdown } from "../components/Dropdown";
import { Pagination } from "../components/Pagination";
import { useDebounce } from "../hooks/useDebounce";
import { SORT_OPTIONS, DEBOUNCE_DELAY } from "../utils/constants";
import type { Book } from "../api/types";

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { data: choices } = useChoices();

  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [bookType, setBookType] = useState("");
  const [ordering, setOrdering] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearch = useDebounce(search, DEBOUNCE_DELAY);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, genre, bookType, ordering]);

  const { data: booksData, isLoading, isError } = useBooks({
    search: debouncedSearch || undefined,
    genre: genre || undefined,
    book_type: bookType || undefined,
    ordering: ordering || undefined,
    page: currentPage,
  });

  const sortOptions = useMemo(() => SORT_OPTIONS, []);

  const genreOptions = useMemo(() => [
    { value: '', label: 'All genres' },
    ...(choices?.genres || [])
  ], [choices?.genres]);

  const bookTypeOptions = useMemo(() => [
    { value: '', label: 'All book types' },
    ...(choices?.book_types || [])
  ], [choices?.book_types]);

  const books = booksData?.results ?? [];
  const pagination = booksData ? {
    currentPage: booksData.current_page,
    totalPages: booksData.total_pages,
    pageSize: booksData.page_size,
    count: booksData.count,
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
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search books by title or author"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:flex-1"
        />

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <CustomDropdown
            options={genreOptions}
            value={genre}
            onChange={(v) => setGenre(String(v))}
            placeholder="Select genre"
            className="w-full sm:w-auto"
          />

          <CustomDropdown
            options={bookTypeOptions}
            value={bookType}
            onChange={(v) => setBookType(String(v))}
            placeholder="Select book type"
            className="w-full sm:w-auto"
          />

          <CustomDropdown
            options={sortOptions}
            value={ordering}
            onChange={(v) => setOrdering(String(v))}
            placeholder="Sort by"
            className="w-full sm:w-auto"
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
