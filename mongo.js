/* eslint-disable */

const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
`mongodb+srv://zkzhu:${password}@cluster0.djzz2.mongodb.net/mini-lib?retryWrites=true`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    progress: Number
})

const Book = mongoose.model('Book', bookSchema)

const book = new Book({
    title: "The Tale of Two Cities",
    author: "Charles Dickens",
    progress: 3.
})


Book.find({}).then(result => {
  result.forEach(book => {
    console.log(book)
  })
  mongoose.connection.close()
})