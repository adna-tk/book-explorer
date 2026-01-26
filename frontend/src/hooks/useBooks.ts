import { useQuery } from "@tanstack/react-query";
import apiClient from "../api/client";
import type { Book, Choice } from "../api/types";

export interface BookQueryParams {
  search?: string;
  genre?: string;
  book_type?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  page_size: number;
  current_page: number;
  total_pages: number;
  results: T[];
}

const fetchBooks = async (params: BookQueryParams): Promise<PaginatedResponse<Book>> => {
  const res = await apiClient.get<PaginatedResponse<Book>>("/books/", {
    params,
  });
  return res.data;
};

const fetchBook = async (id: string): Promise<Book> => {
  const res = await apiClient.get<Book>(`/books/${id}/`);
  return res.data;
};

const fetchChoices = async (): Promise<Choice> => {
  const res = await apiClient.get<Choice>("/books/choices/");
  return res.data;
};

export const useBooks = (params: BookQueryParams) => {
  return useQuery<PaginatedResponse<Book>>({
    queryKey: ["books", params],
    queryFn: () => fetchBooks(params),
    placeholderData: (previousData) => previousData,
  });
};


export const useBook = (id: string) =>
  useQuery({
    queryKey: ["book", id],
    queryFn: () => fetchBook(id),
  });

export const useChoices = () =>
  useQuery({
    queryKey: ["choices"],
    queryFn: fetchChoices,
  });