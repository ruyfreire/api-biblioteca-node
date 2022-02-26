import { SchemaOf, string, array, number } from 'yup'
import { ICreateBook } from '../../services/BookService'
import { GlobalSchema } from './globalSchema'

const schemaCreateBook: SchemaOf<ICreateBook> = GlobalSchema.shape({
  name: string().min(3).max(100).required(),
  summary: string().min(6).max(500).required(),
  authors: array().of(string().uuid().required()).required()
})

export const validatorCreateBook = (body: any) => {
  return schemaCreateBook.validate(body, {
    abortEarly: false
  })
}
