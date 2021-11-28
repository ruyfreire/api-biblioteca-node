import { SchemaOf, string } from 'yup'
import { ICreateBook } from '../../services/BookService'
import { GlobalSchema } from './globalSchema'

export const schemaCreateBook: SchemaOf<ICreateBook> = GlobalSchema.shape({
  name: string().min(3).max(100).required(),
  summary: string().min(6).max(500).required()
})
