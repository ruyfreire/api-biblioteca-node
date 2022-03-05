import { PrismaClient, Prisma } from '.prisma/client'

const configClient: Prisma.PrismaClientOptions = {}

const { NODE_ENV } = process.env

if (NODE_ENV !== 'test') {
  configClient.log = ['query', 'info', 'warn', 'error']
}

const prismaClient = new PrismaClient(configClient)

export { prismaClient }
