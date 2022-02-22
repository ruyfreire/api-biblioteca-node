-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_author_book" (
    "authorId" INTEGER NOT NULL,
    "bookId" INTEGER NOT NULL,

    PRIMARY KEY ("authorId", "bookId"),
    CONSTRAINT "author_book_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "authors" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "author_book_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_author_book" ("authorId", "bookId") SELECT "authorId", "bookId" FROM "author_book";
DROP TABLE "author_book";
ALTER TABLE "new_author_book" RENAME TO "author_book";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
