import VuexORM from '@vuex-orm/core'
import VuexORMAxios from '@vuex-orm/plugin-axios'

import Show from './models/Show'

// Create new instance of database
const database = new VuexORM.Database()
database.register(Show)

VuexORM.use(VuexORMAxios, {
  database,
  http: {
    baseURL: 'http://localhost:3000',
    url: '/',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }
})

export default VuexORM.install(database)
