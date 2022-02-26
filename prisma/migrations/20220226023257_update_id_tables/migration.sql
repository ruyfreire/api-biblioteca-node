/*
  Warnings:

  - The primary key for the `author_book` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `authors` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `books` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_author_book" (
    "authorId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,

    PRIMARY KEY ("authorId", "bookId"),
    CONSTRAINT "author_book_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "authors" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "author_book_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_author_book" ("authorId", "bookId") SELECT "authorId", "bookId" FROM "author_book";
DROP TABLE "author_book";
ALTER TABLE "new_author_book" RENAME TO "author_book";
CREATE TABLE "new_authors" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);
INSERT INTO "new_authors" ("id", "name") SELECT "id", "name" FROM "authors";
DROP TABLE "authors";
ALTER TABLE "new_authors" RENAME TO "authors";
CREATE UNIQUE INDEX "authors_name_key" ON "authors"("name");
CREATE TABLE "new_books" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "summary" TEXT NOT NULL
);
INSERT INTO "new_books" ("id", "name", "summary") SELECT "id", "name", "summary" FROM "books";
DROP TABLE "books";
ALTER TABLE "new_books" RENAME TO "books";
CREATE UNIQUE INDEX "books_name_key" ON "books"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
