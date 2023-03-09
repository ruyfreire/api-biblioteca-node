import { faker } from '@faker-js/faker'

import { CreateBookDatabase } from '../../../../src/services/BookService'

export const createOnDatabase = (
  data?: CreateBookDatabase
): CreateBookDatabase => ({
  id: data?.id || faker.datatype.uuid(),
  name: data?.name || faker.commerce.productName(),
  summary: data?.summary || faker.commerce.productDescription(),
  authors: data?.authors || [faker.datatype.uuid()]
})
