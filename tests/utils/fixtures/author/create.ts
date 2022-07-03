import { faker } from '@faker-js/faker'

import { ICreateAuthor } from '../../../../src/services/AuthorService'

export const create = (data?: ICreateAuthor): ICreateAuthor => ({
  name: data?.name || faker.name.findName()
})
