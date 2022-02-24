import { prismaClient } from '../src/prisma'
import {
  createTableQueries,
  dropTableQueries,
  clearTableQueries
} from './utils/queries'

beforeAll(async () => {
  await Promise.all(
    createTableQueries.map((query) => prismaClient.$queryRaw(query))
  )
})

afterEach(async () => {
  await Promise.all(
    clearTableQueries.map((query) => prismaClient.$queryRaw(query))
  )
})

afterAll(async () => {
  await Promise.all(
    dropTableQueries.map((query) => prismaClient.$queryRaw(query))
  )
})
