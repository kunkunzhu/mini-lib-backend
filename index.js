const express = require('express')
const app = express()
const cors = require('cors')

require('dotenv').config()
const Book = require('./models/book')

// MIDDLEWARES
// (the execution order of middleware is the same as the order that they are loaded into express)

app.use(express.static('build'))
app.use(cors())
app.use(express.json())

/* request logging */
const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

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

app.use(requestLogger)

/* initial books */
// let books = [
//     {
//         id: 1,
//         title: "This One Wild and Precious Life",
//         author: "Sarah Wilson",
//         progress: 2
//     },
//     {
//         id: 2,
//         title: "User Friendly",
//         author: "Cliff Kuang & Robert Fabricant",
//         progress: 2
//     },
//     {
//         id: 5,
//         title: "The Defining Decade",
//         author: "Meg Jay",
//         progress: 1
//     }
// ]

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
    response.json(books)
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
        .catch(error => next(error)
    )
})


/* creating a new book */
app.post('/api/books', (request, response, next) => {
    const body = request.body

    for (let i = 0; i < body.length; i++) {
        if (books[i].title === body.title && 
            books[i].author === body.author) {
            return response.status(400).json({ 
                error: 'this book already exists' 
            })
        }
    }

    const book = new Book({
        title: body.title,
        author: body.author,
        progress: body.progress || 2,
    })

    book
    // example of promise chaining
        .save()
        .then(savedBook => savedBook.toJSON())
        .then(savedAndFormattedBook => {
            response.json(savedAndFormattedBook)
        })
        .catch(error => next(error))
})


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  
app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})