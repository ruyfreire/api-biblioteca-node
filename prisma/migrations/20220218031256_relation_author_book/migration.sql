-- CreateTable
CREATE TABLE "author_book" (
    "authorId" INTEGER NOT NULL,
    "bookId" INTEGER NOT NULL,

    PRIMARY KEY ("authorId", "bookId"),
    CONSTRAINT "author_book_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "authors" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "author_book_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
