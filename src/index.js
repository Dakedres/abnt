const App = require('./App'),
      constants = require('./util/constants')

const app = new App()

app.init.start()
window.le._apps[constants.app.id] = app
system42.trigger('abnt:ready')