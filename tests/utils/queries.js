import { Prisma } from '@prisma/client'

export const createTableQueries = [
  Prisma.sql`CREATE TABLE IF NOT EXISTS main.books (
        id TEXT NOT NULL PRIMARY KEY,
        name TEXT UNIQUE,
        summary TEXT
    )`,
  Prisma.sql`CREATE TABLE IF NOT EXISTS main.authors (
        id TEXT NOT NULL PRIMARY KEY,
        name TEXT UNIQUE
    )`,
  Prisma.sql`CREATE TABLE IF NOT EXISTS main.author_book (
        authorId TEXT NOT NULL,
        bookId TEXT NOT NULL,
    
        PRIMARY KEY ("authorId", "bookId"),
        CONSTRAINT "author_book_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "authors" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "author_book_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    )`
]

export const dropTableQueries = [
  Prisma.sql`DROP TABLE IF EXISTS main.author_book`,
  Prisma.sql`DROP TABLE IF EXISTS main.books`,
  Prisma.sql`DROP TABLE IF EXISTS main.authors`
]

export const clearTableQueries = [
  Prisma.sql`DELETE FROM main.author_book`,
  Prisma.sql`DELETE FROM main.books`,
  Prisma.sql`DELETE FROM main.authors`
]
