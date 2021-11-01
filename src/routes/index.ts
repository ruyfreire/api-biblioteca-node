import { Router } from 'express'
import { createAuthorController } from '../controllers/AuthorController'
import { HomeController } from '../controllers/HomeController'

const Routes = Router()

Routes.get('/', HomeController)

Routes.post('/author', createAuthorController)

export { Routes }
