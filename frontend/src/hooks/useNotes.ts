import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../api/client";

export interface UserNote {
  id: number;
  book: number;
  note: string;
  created_at: string;
  updated_at: string;
}

const fetchNotes = async (bookId: string): Promise<UserNote[]> => {
  const res = await apiClient.get(`/books/${bookId}/notes/`);
  return res.data;
};

const createNote = async (bookId: string, note: string): Promise<UserNote> => {
  const res = await apiClient.post(`/books/${bookId}/notes/`, { note });
  return res.data;
};

const updateNote = async (noteId: number, note: string): Promise<UserNote> => {
  const res = await apiClient.put(`/books/notes/${noteId}/`, { note });
  return res.data;
};

const deleteNote = async (noteId: number): Promise<void> => {
  await apiClient.delete(`/books/notes/${noteId}/`);
};

export const useNotes = (bookId: string | undefined) => {
  return useQuery({
    queryKey: ["notes", bookId],
    queryFn: () => fetchNotes(bookId!),
    enabled: !!bookId,
  });
};

export const useCreateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookId, note }: { bookId: string; note: string }) =>
      createNote(bookId, note),
    onSuccess: (_, variables) => {
      // Invalidate and refetch notes
      queryClient.invalidateQueries({ queryKey: ["notes", variables.bookId] });
    },
  });
};

export const useUpdateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ noteId, note }: { noteId: number; note: string }) =>
      updateNote(noteId, note),
    onSuccess: (data) => {
      // Invalidate and refetch notes for the book
      queryClient.invalidateQueries({ queryKey: ["notes", data.book] });
    },
  });
};

export const useDeleteNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ noteId, bookId }: { noteId: number; bookId: number }) =>
      deleteNote(noteId),
    onSuccess: (_, variables) => {
      // Invalidate and refetch notes
      queryClient.invalidateQueries({ queryKey: ["notes", variables.bookId.toString()] });
    },
  });
};
