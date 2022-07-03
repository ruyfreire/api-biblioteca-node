import { faker } from '@faker-js/faker'

import { CreateAuthorDatabase } from '../../../../src/services/AuthorService'

export const createOnDatabase = (
  data?: CreateAuthorDatabase
): CreateAuthorDatabase => ({
  id: data?.id || faker.datatype.uuid(),
  name: data?.name || faker.name.findName()
})
