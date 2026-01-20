import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { ArrowLeft } from "lucide-react";
import { useBook } from "../hooks/useBooks";
import { Loader } from "../components/Loader";
import PlaceholderImage from "../assets/placeholder.jpg"

export const BookDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: book, isLoading, isError } = useBook(id!);
    console.log("book", book)

    if (isLoading) { return <Loader /> }

    if (isError || !book) {
        return (
            <div className="mt-16 text-center text-light">
                Error loading book.
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-4">
            <Button
                variant="secondary"
                icon={<ArrowLeft size={18} />}
                onClick={() => navigate(-1)}
                className="mb-6"
            >
                Back
            </Button>

            <div className="flex flex-col md:flex-row gap-6 ">
                <img
                    src={book.cover_image ? book.cover_image : PlaceholderImage}
                    alt={book.title}
                    className="mb-4 h-70 w-48 rounded-lg object-cover"
                />

                <div className="flex-1">
                    <h1 className="text-2xl font-semibold text-secondary mb-1 text-center">
                        {book.title}
                    </h1>
                    <p className="text-muted mb-2 text-center">by {book.author}</p>
                    <p className="text-accent font-medium uppercase mb-1">{book?.genre ?? ''}</p>
                    <p className="text-light mb-4">{book.published_year ? `Published: ${book.published_year}` : ''}</p>
                    <div className="text-secondary">{book?.description ?? ''}</div>
                </div>
            </div>
        </div>
    );
};
