import { Model } from "../database";

export interface Book extends Model {
  title: string;
  author: string;
  year: string;
  total_sold: number;
  likes: number;
  rating: number;
  genre: string;
  tags: string[];
  publisher: string;
  released_date: Date;
  slug: string;
  description: string;
  price: number;
  available_copies: number;
  images?: string[];
}

export interface BookDTO {
  title: string;
  author: string;
  year: string;
  total_sold: number;
  likes: number;
  rating: number;
  genre: string;
  tags: string[];
  publisher: string;
  released_date: Date;
  slug: string;
  description: string;
  price: number;
  available_copies: number;
}

export interface BookQuery {
  title?: string;
  author?: string;
  year?: string;
  genre?: string;
  tags?: string[];
  publisher?: string;
  slug?: string;
  limit?: number;
  offset?: number;
}
