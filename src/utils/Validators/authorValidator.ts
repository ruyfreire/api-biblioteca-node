import { SchemaOf, string } from 'yup'
import { ICreateAuthor } from '../../services/AuthorService'
import { GlobalSchema } from './globalSchema'

export const schemaCreateAuthor: SchemaOf<ICreateAuthor> = GlobalSchema.shape({
  name: string().required()
})
