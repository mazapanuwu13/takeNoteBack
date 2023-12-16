import express from 'express'
import notesRoutes from './routes/notes.routes.js'
import indexRoutes from './routes/index.routes.js'
import cors from 'cors'; 

const app = express()
const corsOptions = {
  origin: 'http://localhost:4200', //Origen de aplicación 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json()) //para recibir primero objetos json y luego pasarlo a las rutas


app.use(indexRoutes)
app.use(notesRoutes)

app.listen(3000)
console.log('Server running on port 3000')