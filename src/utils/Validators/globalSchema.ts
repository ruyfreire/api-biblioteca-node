/* eslint-disable no-template-curly-in-string */
import { object, setLocale } from 'yup'

setLocale({
  mixed: {
    notType: 'O campo [${path}] precisa ser do tipo [${type}]',
    required: 'Campo obrigatório: ${path}'
  },
  object: {
    noUnknown: 'Campos desconhecidos: [${unknown}]'
  },
  string: {
    min: 'O campo [${path}] precisa ter no mínimo ${min} caracteres',
    max: 'O campo [${path}] precisa ter no máximo ${max} caracteres',
    email: 'O campo [${path}] precisa ser um email válido',
    url: 'O campo [${path}] precisa ser uma URL válida'
  }
})

export const GlobalSchema = object().strict().noUnknown(true)
