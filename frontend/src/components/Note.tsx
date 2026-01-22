import React, { useState, useEffect } from "react";
import { Button } from "./Button";
import { Pencil, Save, Trash2, X } from "lucide-react";

interface NoteProps {
    createdAt: string;
    value?: string;
    onSave: (note: string) => void | Promise<void>;
    onDelete?: () => void | Promise<void>;
    onCancel?: () => void;
    placeholder?: string;
}

export const Note: React.FC<NoteProps> = ({
    createdAt,
    value = "",
    onSave,
    onDelete,
    onCancel,
    placeholder = "Write a note...",
}) => {
    const [isEditing, setIsEditing] = useState(!value);
    const [note, setNote] = useState(value);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setNote(value);
        setIsEditing(!value);
    }, [value]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave(note);
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to save note:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setNote(value);
        setIsEditing(false);
        if (!value && onCancel) {
            onCancel();
        }
    };

    const handleDelete = async () => {
        if (onDelete) {
            try {
                await onDelete();
            } catch (error) {
                console.error("Failed to delete note:", error);
            }
        }
    };

    const showDeleteButton = note && onDelete;

    return (
        <div className="rounded-xl border border-secondary/20 bg-card p-4 shadow-sm">
            {isEditing ? (
                <>
                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder={placeholder}
                        rows={3}
                        className="w-full resize-none rounded-lg border border-secondary/20 bg-transparent p-2 text-sm text-secondary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40"
                    />

                    <div className="mt-3 flex justify-end gap-2">
                        <Button
                            variant="secondary"
                            onClick={handleCancel}
                            icon={<X size={14} />}
                            disabled={isSaving}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSave}
                            icon={<Save size={14} />}
                            disabled={isSaving}
                        >
                            {isSaving ? "Saving..." : "Save"}
                        </Button>
                    </div>
                </>
            ) : (
                <div className="flex justify-between items-start gap-6">
                    <div className="flex flex-col gap-2 w-full">
                        <p className="whitespace-pre-wrap text-sm w-full text-secondary">
                            {note}
                        </p>
                        <p className="text-xs text-muted">
                            {new Date(createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="flex justify-end  gap-2">
                        <Button
                            variant="secondary"
                            onClick={() => setIsEditing(true)}
                            icon={<Pencil size={14} />}
                        >

                        </Button>

                        {showDeleteButton && (
                            <Button
                                variant="secondary"
                                onClick={handleDelete}
                                icon={<Trash2 size={14} />}
                            >

                            </Button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
