const express = require('express')
const app = express()

app.use(express.json())

/* middleware - request logging */
const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}
  
app.use(requestLogger)

app.use(express.static('build'))

/* middleware - allow request from all origins */
const cors = require('cors')
const { response } = require('express')

app.use(cors())

/* initial books */
let books = [
    {
        id: 1,
        title: "This One Wild and Precious Life",
        author: "Sarah Wilson",
        progress: 2
    },
    {
        id: 2,
        title: "User Friendly",
        author: "Cliff Kuang & Robert Fabricant",
        progress: 2
    },
    {
        id: 3,
        title: "Do Not Say We Have Nothing",
        author: "Madeleine Thien",
        progress: 3
    },
    {
        id: 4,
        title: "Little Fires Everywhere",
        author: "Celeste Ng",
        progress: 3
    },
    {
        id: 5,
        title: "The Defining Decade",
        author: "Meg Jay",
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
app.get('/api/books/:id', (request, response) => {
    const id = Number(request.params.id)
    const book = books.find(b => b.id === id)
    response.json(book)

    if (book) {
        response.json(book)
    } else {
        response.status(404).end()
    }
})

/* deleting a specific book */
app.delete('/api/books/:id', (request, response) => {
    const id = Number(request.params.id)
    books = books.filter(b => b.id !== id)
  
    response.status(204).end()
})
  
/* getting all books */
app.get('/api/books', (response) => {
    response.json(books)
})

/* change the progress of a book */
app.put('/api/books/:id', (request, response) => {
    console.log("HELLO")
    const body = request.body
    
    const book = {
        title: body.title,
        author: body.author,
        progress: body.progress,
        id: body.id,
    }

    console.log(book)

    for (let i = 0; i < books.length; i++) {
        if (books[i].id == id) {
            books[i] = book;
        }
    }
    
    books.id = body.progress;

    response.json(book)
})

/* creating a new book */
app.post('/api/books', (request, response) => {
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

    books = books.concat(book)

    response.json(book)
})


const unknownEndpoint = (response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})