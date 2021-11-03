import { Router } from 'express'
import {
  createAuthorController,
  getAllAuthorsController
} from '../controllers/AuthorController'
import { HomeController } from '../controllers/HomeController'

const Routes = Router()

Routes.get('/', HomeController)

Routes.post('/author', createAuthorController)

Routes.get('/author', getAllAuthorsController)

export { Routes }
