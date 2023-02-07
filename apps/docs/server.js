const express = require('express')

const app = express()
const version = "2.2"
app.use(express.static('./build/site'))
app.get('/', (req, res) => res.redirect('neodash/' + version))
app.listen(8000, () => console.log('📘 http://localhost:8000'))