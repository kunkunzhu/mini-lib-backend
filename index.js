/* eslint-disable */

require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Book = require('./models/book')

// MIDDLEWARES
// (the execution order of middleware is the same as the order that they are loaded into express)

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

/* request logging */
const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}
  
app.use(requestLogger)

/* error handling */
const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
  
    next(error)
}

/* initial books */
let books = [
    {
        id: 1,
        title: 'This One Wild and Precious Life',
        author: 'Sarah Wilson',
        progress: 2
    },
    {
        id: 2,
        title: 'User Friendly',
        author: 'Cliff Kuang & Robert Fabricant',
        progress: 2
    },
    {
        id: 3,
        title: 'Do Not Say We Have Nothing',
        author: 'Madeleine Thien',
        progress: 3
    },
    {
        id: 4,
        title: 'Little Fires Everywhere',
        author: 'Celeste Ng',
        progress: 3
    },
    {
        id: 5,
        title: 'The Defining Decade',
        author: 'Meg Jay',
        progress: 1
    }
]

/* creating a unique ID */
const generateId = () => {
    const maxId = books.length > 0
        ? Math.max(...books.map(n => n.id))
        : 0
    return maxId + 1
}

// API CALLS

/* finding a specific book */
app.get('/api/books/:id', (request, response, next) => {
    Book.findById(request.params.id)
        .then(book => {
            if (book) {
                response.json(book)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

/* deleting a specific book */
app.delete('/api/books/:id', (request, response, next) => {
    Book.findByIdAndRemove(request.params.id)
        .then(result => {
            console.log(result)
            response.status(204).end()
        })
        .catch(error => next(error))
})
  
/* getting all books */
app.get('/api/books', (request, response) => {
    Book.find({}).then(books => {
        response.json(books)
    })
})

/* change the progress of a book */
app.put('/api/books/:id', (request, response, next) => {
    const body = request.body
  
    const book = {
        title: body.title,
        author: body.author,
        progress: body.progress,
    }
  
    Book.findByIdAndUpdate(request.params.id, book, { new: true })
        .then(updatedBook => {
            response.json(updatedBook)
        })
        .catch(error => next(error))
})

/* creating a new book */
app.post('/api/books', (request, response, next) => {
    console.log(request.body)
    const body = request.body

    const book = {
        title: body.title,
        author: body.author,
        progress: body.progress || 2,
        id: generateId(),
    }

    for (let i = 0; i < books.length; i++) {
        if (books[i].title === book.title && 
            books[i].author === book.author) {
            return response.status(400).json({ 
                error: 'this book already exists' 
            })
        }
    }

    book
    // example of promise chaining
        .save()
        .then(savedBook => savedBook.toJSON())
        .then(savedAndFormattedBook => {
            response.json(savedAndFormattedBook)
        })
        .catch(error => next(error))
})

/* unknown endpoint */
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
app.use(errorHandler)  // last loaded middleware

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})