// only defines the Mongoose schema for books
const mongoose = require('mongoose')

const url =  process.env.MONGODB_URI
console.log('connecting to', url)

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    progress: Number,
})

bookSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})

module.exports = mongoose.model('Book', bookSchema)