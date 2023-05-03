import { SingleDocument } from '../types/types'
import Urbit from '@urbit/http-api'

export const API_KEY_LOCALSTORAGE_KEY = 'alzabo-apikey'

export const api = new Urbit('')
// @ts-ignore window typings
api.ship = window.ship
// @ts-ignore window typings
window.api = api
api.verbose = true