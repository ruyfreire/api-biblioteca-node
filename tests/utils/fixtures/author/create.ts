import Chance from 'chance'
import { ICreateAuthor } from '../../../../src/services/AuthorService'

const chance = new Chance()

export const create = (data?: ICreateAuthor): ICreateAuthor => ({
  name: data?.name || chance.name()
})
