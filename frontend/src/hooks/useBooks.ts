import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const fetchBooks = async (): Promise<Book[]> => {
  const res = await axios.get(`${API_BASE_URL}/books/`);
  return res.data;
};

const fetchBook = async (id: string): Promise<Book> => {
  const res = await axios.get(`${API_BASE_URL}/books/${id}/`);
  return res.data;
};

export const useBooks = () =>
  useQuery({
    queryKey: ["books"],
    queryFn: fetchBooks,
  });

export const useBook = (id: string) =>
  useQuery({
    queryKey: ["book", id],
    queryFn: () => fetchBook(id),
  });
