import Chance from 'chance'
import { CreateAuthorDatabase } from '../../../../src/services/AuthorService'

const chance = new Chance()

export const createOnDatabase = (
  data?: CreateAuthorDatabase
): CreateAuthorDatabase => ({
  id: data?.id || chance.guid({ version: 4 }),
  name: data?.name || chance.name()
})
