const app = require('./app')

app.listen(app.get('port'), () => console.log(`app running at ${app.get('port')}`))