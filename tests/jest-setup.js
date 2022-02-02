import { prismaClient } from '../src/prisma'

beforeAll(async () => {
  await prismaClient.$queryRaw`CREATE TABLE main.books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE,
      summary TEXT
      )`
})

afterAll(async () => {
  await prismaClient.$queryRaw`DROP TABLE main.books`
})
