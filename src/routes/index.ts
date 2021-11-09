import { Router } from 'express'
import {
  createAuthorController,
  deleteAuthorController,
  getAllAuthorsController,
  getAuthorByIdController,
  putAuthorController
} from '../controllers/AuthorController'
import { notFoundController } from '../controllers/NotFoundController'

const Routes = Router()

Routes.route('/author')
  .get(getAllAuthorsController)
  .post(createAuthorController)

Routes.route('/author/:id')
  .get(getAuthorByIdController)
  .put(putAuthorController)
  .delete(deleteAuthorController)

Routes.all('*', notFoundController)

export { Routes }
