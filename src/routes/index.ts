import { Router } from 'express'
import {
  createAuthorController,
  deleteAuthorController,
  getAllAuthorsController,
  getAuthorByIdController,
  putAuthorController
} from '../controllers/AuthorController'
import {
  createBookController,
  getAllBookController,
  getByIdBookController,
  updateBookController,
  deleteBookController
} from '../controllers/BookController'
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
  .post((req, res) => createBookController.execute(req, res))
  .get((req, res) => getAllBookController.execute(req, res))

Routes.route('/book/:id')
  .get((req, res) => getByIdBookController.execute(req, res))
  .put((req, res) => updateBookController.execute(req, res))
  .delete((req, res) => deleteBookController.execute(req, res))

Routes.all('*', notFoundController)

export { Routes }
