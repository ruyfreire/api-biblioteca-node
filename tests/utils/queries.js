import { prismaClient } from '../../src/prisma'

export const createTableQueries = [
  prismaClient.$executeRaw`CREATE TABLE IF NOT EXISTS main.books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE,
        summary TEXT
    )`,
  prismaClient.$executeRaw`CREATE TABLE IF NOT EXISTS main.authors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE
    )`,
  prismaClient.$executeRaw`CREATE TABLE IF NOT EXISTS main.author_book (
        authorId INTEGER NOT NULL,
        bookId INTEGER NOT NULL,
    
        PRIMARY KEY ("authorId", "bookId"),
        CONSTRAINT "author_book_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "authors" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "author_book_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    )`
]

export const dropTableQueries = [
  prismaClient.$executeRaw`DROP TABLE IF EXISTS main.author_book`,
  prismaClient.$executeRaw`DROP TABLE IF EXISTS main.books`,
  prismaClient.$executeRaw`DROP TABLE IF EXISTS main.authors`
]

export const clearTableQueries = [
  prismaClient.$executeRaw`DELETE FROM main.author_book`,
  prismaClient.$executeRaw`DELETE FROM main.books`,
  prismaClient.$executeRaw`DELETE FROM main.authors`
]
