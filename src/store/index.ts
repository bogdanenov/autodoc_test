import { createStore } from 'vuex'
import api from './modules/api'
import table from './modules/table'
import charts from './modules/charts'

export default createStore({
  modules: {
		api,
		table,
		charts
  }
})
