const booksRouter = require('express').Router()
const Book = require('../models/book')

/* finding a specific book */
booksRouter.get('/:id', (request, response, next) => {
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
booksRouter.delete('/:id', (request, response, next) => {
    Book.findByIdAndRemove(request.params.id)
        .then(result => {
            console.log(result)
            response.status(204).end()
        })
        .catch(error => next(error))
})
  
/* getting all books */
booksRouter.get('/', (request, response) => {
    response.json(books)
})

/* change the progress of a book */
booksRouter.put('/:id', (request, response, next) => {
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
booksRouter.post('/', (request, response, next) => {
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

module.exports = booksRouter