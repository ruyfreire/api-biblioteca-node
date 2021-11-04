import { Router } from 'express'
import {
  createAuthorController,
  getAllAuthorsController,
  getAuthorByIdController,
  putAuthorController
} from '../controllers/AuthorController'
import { HomeController } from '../controllers/HomeController'

const Routes = Router()

Routes.get('/', HomeController)

Routes.post('/author', createAuthorController)

Routes.get('/author', getAllAuthorsController)

Routes.get('/author/:id', getAuthorByIdController)

Routes.put('/author/:id', putAuthorController)

export { Routes }
