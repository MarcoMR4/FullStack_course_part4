
const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const notesRouter = require('./controllers/notes')
const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
.then(() => {
    logger.info('connected to MongoDB')
})
.catch(error => {
    logger.error('error connecting to MongoDB: ', error.message)
})

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/notes', notesRouter)
app.use('/api/blogs', blogsRouter)

app.use(middleware.unknownEndPoint)
app.use(middleware.errorHandler)

module.exports = app

// const config = require('./utils/config');
// const express = require('express');
// const app = express();
// const cors = require('cors');
// const middleware = require('./utils/middleware');
// const logger = require('./utils/logger');
// const mongoose = require('mongoose');
// const createNotesRouter = require('./controllers/notes');

// mongoose.set('strictQuery', false);

// //                                              PRECE QUE TENDREMOS QUE USAR 2 COLECCIONES EN VEZ DE 2 DB 

// const connection1 = mongoose.createConnection(config.MONGODB_URI);
// const connection2 = mongoose.createConnection(config.MONGODB_URI_2);

// connection1.on('connected', () => logger.info('Connected to MongoDB1'));
// connection1.on('error', (error) => logger.error('Error connecting to MongoDB1:', error.message));

// connection2.on('connected', () => logger.info('Connected to MongoDB2'));
// connection2.on('error', (error) => logger.error('Error connecting to MongoDB2:', error.message));

// const noteSchema = require('./models/note');
// const blogSchema = require('./models/blog');

// const Note = connection1.model('Note', noteSchema);
// const Blog = connection2.model('Blog', blogSchema)

// // Middleware
// app.use(cors());
// app.use(express.static('dist'));
// app.use(express.json());
// app.use(middleware.requestLogger);

// // Rutas
// app.use('/api/notes', createNotesRouter(Note)); 
// // CREAR EL CONTROLLER PARA BLOG 


app.use(middleware.unknownEndPoint);
app.use(middleware.errorHandler);

module.exports = app;
