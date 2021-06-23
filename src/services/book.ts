import { BookRepo, BookDTO, BookQuery, Book } from "@app/data/book";
import { orFromQueryMap } from "@app/data/util";
import uploadImage from "./upload";
import { Request, Response } from "express";

class BookService {
  async addBook(book: BookDTO, req: Request, res: Response) {
    await uploadImage(req, res)
    book["images"] = req["imageUrls"];

    if (!book["images"]) throw new Error("Image is required.");

    return await BookRepo.create(book)
  }

  async getBook(id: string): Promise<Book> {
    return await BookRepo.byID(id)
  }

  async likeBook(id: string): Promise<Book> {
    const book = await BookRepo.byID(id)

    book["likes"] += 1

    return await BookRepo.update({ _id: id}, {
      likes: book["likes"]
    })
  }

  async removeLikeFromBook(id: string): Promise<Book> {
    const book = await BookRepo.byID(id)

    book["likes"] -= 1

    return await BookRepo.update({ _id: id}, {
      likes: book["likes"]
    })
  }

  /**
   * all books are returned if no query parameter is pass
   * @param query - search by title, author, genre, tags, publisher, slug
   */
  async getBooks(query: BookQuery) {
    const titleRegex = query.title && new RegExp(`.*${query.title}.*`, "i");
    const authorRegex = new RegExp(`.*${query.author}.*`, "i");
    const genreRegex = new RegExp(`.*${query.genre}.*`, "i");
    const tagsRegex = new RegExp(`.*${query.tags}.*`, "i");
    const publisherRegex = new RegExp(`.*${query.publisher}.*`, "i");
    const slugRegex = new RegExp(`.*${query.slug}.*`, "i"); 

    const conditions = orFromQueryMap(query, {
      title: { title: titleRegex },
      author: { author: authorRegex },
      year: { year: query.year },
      genre: { genre: genreRegex },
      tags: { tags: { $elemMatch: { $regex: tagsRegex } } },
      publisher: { publisher: publisherRegex },
      slug: { slug: slugRegex }
    });

    const limit = Number(query.limit);
    const offset = Number(query.offset);
    return new Promise<Book[]>((resolve, reject) => {
      let directQuery = BookRepo.model.find(conditions).skip(offset).sort({ created_at: -1 });

      if (query.limit !== 0) {
        directQuery = directQuery.limit(limit ? limit: 24);
      }

      return directQuery.exec((err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  }
}

export const Books = new BookService();
