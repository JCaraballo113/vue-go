export type Genre = { id: number; genre_name: string; created_at: string; updated_at: string };

export type Book = {
  id: number;
  title: string;
  slug: string;
  publication_year: number;
  author: {
    id: number;
    author_name: string;
    created_at: string;
    updated_at: string;
  };
  description: string;
  genres: Genre[];
};

export type SelectItem = {
  value: string;
  text: string;
}