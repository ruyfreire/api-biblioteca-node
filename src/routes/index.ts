import { Router } from 'express'
import {
  createAuthorController,
  deleteAuthorController,
  getAllAuthorsController,
  getAuthorByIdController,
  putAuthorController
} from '../controllers/AuthorController'
import { BookController } from '../controllers/BookController'
import { notFoundController } from '../controllers/NotFoundController'

const Routes = Router()

Routes.route('/author')
  .get(getAllAuthorsController)
  .post(createAuthorController)

Routes.route('/author/:id')
  .get(getAuthorByIdController)
  .put(putAuthorController)
  .delete(deleteAuthorController)

Routes.route('/book')
  .post(new BookController().create)
  .get(new BookController().getAll)

Routes.route('/book/:id')
  .get(new BookController().getById)
  .put(new BookController().update)
  .delete(new BookController().delete)

Routes.all('*', notFoundController)

export { Routes }
