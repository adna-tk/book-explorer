interface Book {
  id: number;
  title: string;
  author: string;
  genre: string | null;
  book_type: string | null;
  published_year: number | null;
  cover_image?: string;
  description?: string;
}

interface DropdownOption {
  label: string;
  value: string;
}
interface Choice {
  genres: DropdownOption[];
  book_types: DropdownOption[];
}
