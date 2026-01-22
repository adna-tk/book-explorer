
export const PAGINATION = {
  MAX_VISIBLE_PAGES: 5,
  DEFAULT_PAGE_SIZE: 12,
} as const;

export const DEBOUNCE_DELAY = 300;

export const SORT_OPTIONS: DropdownOption[] = [
  { value: '', label: 'Default (Title)' },
  { value: 'published_year', label: 'Year: Oldest First' },
  { value: '-published_year', label: 'Year: Newest First' },
  { value: 'title', label: 'Title: A-Z' },
  { value: '-title', label: 'Title: Z-A' },
  { value: 'author', label: 'Author: A-Z' },
  { value: '-author', label: 'Author: Z-A' },
  { value: '-created_at', label: 'Newest Added' },
  { value: 'created_at', label: 'Oldest Added' },
];
