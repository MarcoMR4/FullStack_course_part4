const Note = require('../models/note')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const initialNotes = [
  {
    content: 'HTML is easy',
    important: false
  },
  {
    content: 'Browser can execute only JavaScript',
    important: true
  }
]

const nonExistingId = async () => {
  const note = new Note({ content: 'willremovethissoon' })
  await note.save()
  await note.deleteOne()

  return note._id.toString()
}

const notesInDb = async () => {
  const notes = await Note.find({})
  return notes.map(note => note.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const getValidToken = async () => {
  const users = await usersInDb()
  const userForToken = {
    username: users[0].username,
    id: users[0].id
  }
  const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: '1h' });
  
  return token
}

module.exports = {
  initialNotes,
  nonExistingId,
  notesInDb,
  usersInDb,
  getValidToken
}