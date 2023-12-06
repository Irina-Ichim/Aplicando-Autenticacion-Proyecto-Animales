const express = require('express')
const mongoose = require('mongoose')
const app = express()
const Animal = require('./animal.controller')
const { Auth, isAuthenticated} = require('./auth.controller')
const port = 3000

mongoose.connect('mongodb://localhost:27017/miapp')

app.use(express.json())

app.get('/animals', isAuthenticatedAnimal.list)
app.post('/animals', isAuthenticatedAnimal.create)
app.put('/animals/:id', isAuthenticatedAnimal.update)
app.patch('/animals/:id', isAuthenticatedAnimal.update)
app.delete('/animals/:id', isAuthenticatedAnimal.destroy)

app.post('/login', Auth.login)
app.post('/register', Auth.register)

app.use(express.static('app'))

app.get('/', (req, res) => {
	res.sendFile(`${__dirname}/index.html`)
})
app.get('*', (req, res) => {
	res.status(404).send('Esta página no existe :(')
})

app.listen(port, () => {
	console.log('Arrancando la aplicación!')
})
