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
import { validatorAuthor } from '../utils/Validators/authorValidator'
import { validatorBook } from '../utils/Validators/bookValidator'
import { validatorId } from '../utils/Validators/validatorId'

const Routes = Router()

Routes.route('/author')
  .get(getAllAuthorsController)
  .post(validatorAuthor, createAuthorController)

Routes.route('/author/:id')
  .get(validatorId, getAuthorByIdController)
  .put(validatorId, validatorAuthor, putAuthorController)
  .delete(validatorId, deleteAuthorController)

Routes.route('/book')
  .post(validatorBook, (req, res) => createBookController.execute(req, res))
  .get((req, res) => getAllBookController.execute(req, res))

Routes.route('/book/:id')
  .get(validatorId, (req, res) => getByIdBookController.execute(req, res))
  .put(validatorId, validatorBook, (req, res) =>
    updateBookController.execute(req, res)
  )
  .delete(validatorId, (req, res) => deleteBookController.execute(req, res))

Routes.all('*', notFoundController)

export { Routes }
