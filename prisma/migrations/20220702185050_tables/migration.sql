-- CreateTable
CREATE TABLE "authors" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "author_id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "books" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "summary" VARCHAR(600) NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "book_id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "author_book" (
    "author_id" UUID NOT NULL,
    "book_id" UUID NOT NULL,

    CONSTRAINT "author_book_pkey" PRIMARY KEY ("author_id","book_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "unique_author_name" ON "authors"("name");

-- CreateIndex
CREATE UNIQUE INDEX "unique_book_name" ON "books"("name");

-- CreateIndex
CREATE INDEX "fki_fk_author_id" ON "author_book"("author_id");

-- CreateIndex
CREATE INDEX "fki_fk_book_id" ON "author_book"("book_id");

-- AddForeignKey
ALTER TABLE "author_book" ADD CONSTRAINT "fk_author_id" FOREIGN KEY ("author_id") REFERENCES "authors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "author_book" ADD CONSTRAINT "fk_book_id" FOREIGN KEY ("book_id") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE CASCADE;
