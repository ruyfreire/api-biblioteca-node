import { prismaClient } from '../src/prisma'

beforeAll(async () => {
  await prismaClient.$queryRaw`CREATE TABLE IF NOT EXISTS main.books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE,
      summary TEXT
      )`

  await prismaClient.$queryRaw`CREATE TABLE IF NOT EXISTS main.authors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE
      )`
})

afterAll(async () => {
  await prismaClient.$queryRaw`DROP TABLE main.books`
  await prismaClient.$queryRaw`DROP TABLE main.authors`
})
