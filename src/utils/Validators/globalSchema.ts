/* eslint-disable no-template-curly-in-string */
import { object, setLocale } from 'yup'

setLocale({
  mixed: {
    notType: 'O campo [${path}] precisa ser do tipo [${type}]',
    required: 'O campo [${path}] é obrigatório'
  },
  object: {
    noUnknown: 'Campos desconhecidos: [${unknown}]'
  }
})

export const GlobalSchema = object().strict().noUnknown(true)
