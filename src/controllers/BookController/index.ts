import { BookService } from '../../services/BookService'
import { CreateBookController } from './CreateBookController'
import { DeleteBookController } from './DeleteBookController'
import { GetAllBookController } from './GetAllBookController'
import { GetByIdBookController } from './GetByIdBookController'
import { UpdateBookController } from './UpdateBookController'

const serviceBook = new BookService()

const createBookController = new CreateBookController(serviceBook)

const getAllBookController = new GetAllBookController(serviceBook)

const getByIdBookController = new GetByIdBookController(serviceBook)

const updateBookController = new UpdateBookController(serviceBook)

const deleteBookController = new DeleteBookController(serviceBook)

export {
  createBookController,
  getAllBookController,
  getByIdBookController,
  updateBookController,
  deleteBookController
}
