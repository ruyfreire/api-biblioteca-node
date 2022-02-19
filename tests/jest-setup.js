import { prismaClient } from '../src/prisma'
import { createTableQueries, dropTableQueries } from './utils/queries'

beforeAll(async () => {
  await Promise.all(
    createTableQueries.map((query) => prismaClient.$queryRaw(query))
  )
})

afterAll(async () => {
  await Promise.all(
    dropTableQueries.map((query) => prismaClient.$queryRaw(query))
  )
})
