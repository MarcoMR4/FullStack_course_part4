const express = require('express')
const app = express()

app.use(express.json())

app.get('/', (request, response) => {
    console.log(request.body)
    response.send('<h1><i>Hello Mark</i></h1>')
})

let contacts = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }, 
    {
        "id" : 5,
        "name" : "Mark Market", 
        "number" : "55-4432868808"
    }
]

app.get('/api/people', (request, response) => {
    console.log("Consulting people ",request.params);
    response.json(contacts);
})

app.get('/api/info', (requesrt, response) => {
    let hour = Date()
    response.send(`
        <p>Phonebook has info for ${contacts.length} people</p>
        <p>
        ${hour}
        <p>
    `)
})

app.get('/api/people/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = contacts.find(person => person.id === id)

    if(person){
        response.json(person)
    }
    else{
        response.statusMessage = "Not found"
        response.status(404).end()
    }
})

const generateId = () => {
    return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
}

app.post('/api/people', (request, response) => {
    const body= request.body

    if(!body.name || !body.number){
        return response.status(400).json({
            error: 'content missing'
        })
    }
   
    contacts.forEach(person => {
        if(person.name === body.name){
            return response.status(400).json({
                error: 'name must be unique.'
            })
        }
    })

    const newPerson = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    contacts = contacts.concat(newPerson)

    response.json(newPerson)

})

app.delete('/api/people/:id', (request, response) => {
    const id = Number(request.params.id)
    contacts = contacts.filter(person => person.id !== id)

    response.status(204).end()
})


const PORT = 3002
app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`)
})