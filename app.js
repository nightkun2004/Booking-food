const express = require('express');
const path = require('path')
const router = require('./router')
const ejs = require('ejs');
const mongoose = require('./config')

const app = express()
const port = 4000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(router)

app.get('/', (req, res) => {
    res.render('index')
})

app.listen(port, () => {
    console.log(`Server in running at http://localhost:${port}`)
})