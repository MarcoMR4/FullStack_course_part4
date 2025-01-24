const mongoose = require('mongoose')

if(process.argv.length<3) {
    console.log('give a password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://marcomr9641:${password}@cluster0.1asuuve.mongodb.net/noteApp?retryWrites=true&w=majority`


mongoose.set('strictQuery', false)

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
    content: 'JSON is cool',
    important: true,
})

// note.save().then(result => {
//     console.log('note saved!')
//     mongoose.connection.close()
// })

Note.find({ important: false }).then(result => {
    if(result.length < 1){
        console.log('There are no any notes to show :C')
    }
    result.forEach(note => {
        console.log(note)
    })
    mongoose.connection.close()
})