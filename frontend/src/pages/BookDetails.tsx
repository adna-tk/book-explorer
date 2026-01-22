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
    const { data: notes = [], isLoading: notesLoading } = useNotes(id);
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
                    <p className="text-accent font-medium uppercase mb-1">
                        {book?.genre?.replace("_", " ") ?? ''}
                    </p>
                    <p className="text-light mb-4">{book.published_year ? `Published: ${book.published_year}` : ''}</p>
                    <div className="text-secondary">{book?.description ?? ''}</div>
                </div>
            </div>

            {isAuthenticated && (
                <div className="mt-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-secondary">My Notes</h2>
                        {!isAddingNewNote && (
                            <Button
                                variant="primary"
                                icon={<Plus size={16} />}
                                onClick={() => setIsAddingNewNote(true)}
                            >
                                Add Note
                            </Button>
                        )}
                    </div>

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
                                />
                            ))}

                            {!isAddingNewNote && notes.length === 0 && (
                                <div className="text-center text-muted py-8">
                                    <p>No notes yet. Click "Add Note" to create your first note.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
