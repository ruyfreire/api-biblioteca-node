import { faker } from '@faker-js/faker'

import { ICreateBook } from '../../../../src/services/BookService'

export const create = (data?: ICreateBook): ICreateBook => ({
  name: data?.name || faker.commerce.productName(),
  summary: data?.summary || faker.commerce.productDescription(),
  authors: data?.authors || [faker.datatype.uuid()]
})
