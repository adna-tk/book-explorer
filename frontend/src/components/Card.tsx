import React, { type MouseEventHandler } from "react";
import PlaceholderImage from "../assets/placeholder.jpg"

interface CardProps {
    book: Book;
    onClick?: MouseEventHandler<HTMLDivElement>;
}

export const Card: React.FC<CardProps> = ({ book, onClick }) => {
    return (
        <div onClick={onClick} className="bg-card cursor-pointer rounded-xl p-4 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg">
            <img
                src={book.cover_image ? book.cover_image : PlaceholderImage}
                alt={book.title}
                className="mb-4 h-48 w-full rounded-lg object-cover"
            />
            <h2 className="border-t border-secondary/20 pt-4 text-lg font-semibold text-secondary truncate">
                {book.title}
            </h2>

            <p className="mt-1 text-muted">{book.author}</p>

            <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-medium uppercase tracking-wide text-accent">
                        {book?.genre?.replace("_", " ") ?? ''}
                    </span>
                    {book?.book_type && <span className="text-xs font-medium uppercase tracking-wide text-light">
                        ({book?.book_type?.replace("_", " ")})
                    </span>}
                </div>


                <span className="text-sm text-light">{book.published_year ? `Published: ${book.published_year}` : ''}</span>
            </div>
        </div>
    );
};
