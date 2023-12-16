import { Router } from "express"
import { getNotes,createNote, updateNote, deleteNote, registerUser, validateUser } from '../controllers/notes.controller.js'
import {authenticateToken} from '../middleware/auth.js'

// const authenticateToken = require('../middleware/auth.js');

const router = Router()
// req: Representa el objeto de la solicitud HTTP y contiene información sobre la solicitud realizada por el cliente.
// res: Representa el objeto de respuesta HTTP que se enviará al cliente.
router.post('/registrar', registerUser)

router.post('/validateUser', validateUser)

router.get('/notas' ,authenticateToken ,getNotes)

router.post('/notas',authenticateToken, createNote)

router.put('/notas',authenticateToken, updateNote)

router.delete('/notas',authenticateToken, deleteNote)


export default router