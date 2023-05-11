import Urbit from '@urbit/http-api'

export const API_KEY_LOCALSTORAGE_KEY = 'alzabo-apikey'

const api = new Urbit('', '', 'alzabo')
// @ts-ignore window typings
api.ship = window.ship
// @ts-ignore window typings
window.api = api
// api.verbose = true

export default api