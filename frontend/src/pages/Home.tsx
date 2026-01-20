import React from "react";
import { useBooks } from "../hooks/useBooks";
import { Card } from "../components/Card";
import { useNavigate } from "react-router-dom";
import { Loader } from "../components/Loader";
import { Input } from "../components/Input";
import { FilterIcon, SearchIcon } from "lucide-react";
import { Button } from "../components/Button";

export const Home: React.FC = () => {
  const { data: books, isLoading, isError } = useBooks();
  const navigate = useNavigate();

  const handleBookClick = (id: number) => {
    navigate(`/book/${id.toString()}`);
  }

  if (isLoading) { return <Loader text="Fetching books .." /> }

  if (isError) {
    return <div className="mt-16 text-center text-light">
      Error loading books.
    </div>
  }

  return (
    <div className="w-full flex flex-col">
      <div className="flex justify-between gap-x-4">

        <Input placeholder="Search books by title or author" />
        <Button variant="primary" className="flex flex-row p-0 items-center w-50" icon={<FilterIcon size={16} />
        }>
          <p className="text-sm">
            Filter by author
          </p>

        </Button>
      </div>
      <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {books && (books || [])?.map((book) => (
          <Card book={book} key={book.id} onClick={() => handleBookClick(book.id)} />
        ))}
      </div>
    </div>
  );
};
