import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { ArrowLeft, Plus } from "lucide-react";
import { useBook } from "../hooks/useBooks";
import { useNotes, useCreateNote, useUpdateNote, useDeleteNote, type UserNote } from "../hooks/useNotes";
import { useAuth } from "../hooks/useAuth";
import { Loader } from "../components/Loader";
import PlaceholderImage from "../assets/placeholder.jpg"
import { Note } from "../components/Note";

export const BookDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [isAddingNewNote, setIsAddingNewNote] = useState(false);

    const { data: book, isLoading, isError } = useBook(id!);
    const { data: notes = [], isLoading: notesLoading } = useNotes(isAuthenticated ? id : undefined);
    const createNoteMutation = useCreateNote();
    const updateNoteMutation = useUpdateNote();
    const deleteNoteMutation = useDeleteNote();

    const handleCreateNote = async (noteText: string) => {
        if (!id) return;
        try {
            await createNoteMutation.mutateAsync({ bookId: id, note: noteText });
            setIsAddingNewNote(false);
        } catch (error) {
            console.error("Failed to create note:", error);
        }
    };

    const handleUpdateNote = async (noteId: number, noteText: string) => {
        try {
            await updateNoteMutation.mutateAsync({ noteId, note: noteText });
        } catch (error) {
            console.error("Failed to update note:", error);
        }
    };

    const handleDeleteNote = async (noteId: number) => {
        if (!id || !book) return;
        try {
            await deleteNoteMutation.mutateAsync({ noteId, bookId: book.id });
        } catch (error) {
            console.error("Failed to delete note:", error);
        }
    };

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

            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex justify-center md:justify-start">
                    <img
                        src={book.cover_image ? book.cover_image : PlaceholderImage}
                        alt={book.title}
                        className="w-full max-w-50 md:w-48 md:max-w-none h-auto rounded-lg object-cover"
                    />
                </div>

                <div className="flex-1">
                    <h1 className="text-xl md:text-2xl font-semibold text-secondary mb-1 text-center md:text-left">
                        {book.title}
                    </h1>
                    <p className="text-muted mb-2 text-center md:text-left">by {book.author}</p>
                    <p className="text-accent font-medium uppercase mb-1 text-center md:text-left">
                        {book?.genre?.replace("_", " ") ?? ''}
                    </p>
                    <p className="text-light mb-4 text-center md:text-left">{book.published_year ? `Published: ${book.published_year}` : ''}</p>
                    <div className="text-secondary text-sm md:text-base">{book?.description ?? ''}</div>
                </div>
            </div>

            <div className="mt-6">
                {isAuthenticated && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                        <h2 className="text-xl font-semibold text-secondary">My Notes</h2>
                        {!isAddingNewNote && (
                            <Button
                                variant="primary"
                                icon={<Plus size={16} />}
                                onClick={() => setIsAddingNewNote(true)}
                                className="w-full sm:w-auto"
                            >
                                Add Note
                            </Button>
                        )}
                    </div>
                )}

                {isAuthenticated ? (
                    <>
                        {notesLoading ? (
                            <Loader text="Loading notes..." />
                        ) : (
                            <div className="space-y-4">
                                {isAddingNewNote && (
                                    <Note
                                        createdAt={new Date().toISOString()}
                                        value=""
                                        onSave={handleCreateNote}
                                        onCancel={() => setIsAddingNewNote(false)}
                                        placeholder="Write your note about this book..."
                                        isSaving={createNoteMutation.isPending}
                                    />
                                )}

                                {notes.map((note: UserNote) => (
                                    <Note
                                        createdAt={note.created_at}
                                        key={note.id}
                                        value={note.note}
                                        onSave={(noteText) => handleUpdateNote(note.id, noteText)}
                                        onDelete={() => handleDeleteNote(note.id)}
                                        placeholder="Write your note about this book..."
                                        isSaving={updateNoteMutation.isPending}
                                    />
                                ))}

                                {!isAddingNewNote && notes.length === 0 && (
                                    <p className="text-center text-sm text-muted py-8 italic">
                                        No notes yet. Click "Add Note" to create your first note.
                                    </p>
                                )}
                            </div>
                        )}
                    </>
                ) : (
                    <p className="text-center text-sm text-muted py-8 italic">
                        In order to add your own personal notes to each book, please log in!
                    </p>
                )}
            </div>
        </div>
    );
};
