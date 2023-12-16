import {pool} from '../db.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

export const registerUser = async (req, res) => {
  const { email, username, password } = req.body;

  try {
    // Verifica si el usuario ya existe en la base de datos
    const [existingUsers] = await pool.query('SELECT * FROM users WHERE email = ? OR username = ?', [email, username]);

    if (existingUsers.length > 0) {
      const existingEmail = existingUsers.find(user => user.email === email);
      const existingUsername = existingUsers.find(user => user.username === username);

      if (existingEmail) {
        return res.status(400).json({ error: 'El correo ya existe' });
      }

      if (existingUsername) {
        return res.status(400).json({ error: 'El nombre de usuario ya existe' });
      }
    }

    // Genera un hash seguro para la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Inserta el nuevo usuario en la base de datos
    const [result] = await pool.query('INSERT INTO users (email, username, password) VALUES (?, ?, ?)', [email, username, hashedPassword]);

    res.status(201).json({ message: 'Usuario registrado con éxito', userId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};


export const validateUser = async (req, res) => {
  const { email, password } = req.body;
  console.log('cuerpo',req.body)

  try {
    // Busca el usuario por correo electrónico
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    // Verifica si se encontró un usuario
    if (rows.length > 0) {
      const user = rows[0];
      // console.log(user)


      // Compara la contraseña proporcionada con la almacenada en la base de datos
      const isPasswordValid = await bcrypt.compare(password, user.password);
      // console.log(isPasswordValid)

      if (isPasswordValid) {
        // Credenciales válidas
        const userData = {
          user_id: user.user_id,
          username: user.username,
        };
        // console.log(userData)

        const token = jwt.sign(userData, 'takeNote', { expiresIn: '1h' });
        // console.log(token)
        res.status(200).json({ mensaje: 'Credenciales válidas', token: token, idUs:user.user_id, name:user.username, status:true});
      } else {
        // Contraseña incorrecta
        res.status(401).json({ mensaje: 'Contraseña incorrecta', status:false });
      }
    } else {
      // Usuario no encontrado
      res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};


export const getNotes = async (req, res) => {
    const user_id = req.query.user_id// Cambiado de req.body a req.params
    console.log( 'id', req.query.user_id);
    try {
        const [rows] = await pool.query('SELECT * FROM notes WHERE user_id = ?', [user_id]);
        // console.log(rows);
        res.send(rows)
        
      } catch (error) {
        console.error('Error en la consulta SQL:', error);
      }
}

export const createNote = async(req, res) => {
  const { title, description, is_processed, user_id } = req.body;
  console.log(req.body);

  try {
      // Verificar si ya existe una nota con el mismo título
      const [existingNoteRows] = await pool.query('SELECT nota_id FROM notes WHERE title = ? AND user_id = ?', [title, user_id]);

      if (existingNoteRows.length > 0) {
          // Ya existe una nota con el mismo título
          res.send({ error: 'El título de la nota ya ha sido registrado', status:false });
      } else {
          // No existe una nota con el mismo título, proceder con la inserción
          const [insertRows] = await pool.query('INSERT INTO notes (title, description, is_processed, user_id) VALUES (?, ?, ?, ?)', [title, description, is_processed, user_id]);

          res.send({
              id: insertRows.insertId,
              title,
              description,
              is_processed,
              user_id,
              status:true,
              message:'La nota se ha registrado correctamente'
          });
      }
  } catch (e) {
      console.error(e);
      res.status(500).send({ error: 'Error interno del servidor' });
  }
};


export const updateNote = async (req, res) => {
  const { noteId, title, description, is_processed, user_id } = req.body;

  try {
    // Verificar si ya existe una nota con el mismo título, descripción y usuario
    const [existingNoteRows] = await pool.query('SELECT nota_id FROM notes WHERE title = ? AND user_id = ?', [title, user_id]);

    if (existingNoteRows.length > 0 && existingNoteRows[0].nota_id !== noteId) {
      // Si ya existe una nota con el mismo título y usuario, pero no es la misma nota que se está actualizando
      
      res.status(400).send({ error: 'El título de la nota ya ha sido registrado', status: false });
    } else {
      // Realizar la actualización en la base de datos
      const [result] = await pool.query(
        'UPDATE notes SET title = ?, description = ?, is_processed = ?, user_id = ? WHERE nota_id = ?',
        [title, description, is_processed, user_id, noteId]
      );

      if (result.affectedRows > 0) {
        res.status(200).send({ message: 'Nota actualizada con éxito', status: true });
      } else {
        res.status(404).send({ error: 'Nota no encontrada', status: false });
      }
    }
  } catch (error) {
    console.error('Error al actualizar la nota', error);
    res.status(500).send({ error: 'Error interno del servidor' });
  }
};




export const deleteNote =  async(req, res) => {
  
  const noteId = req.query.nota_id;
  // console.log('noteid: ', noteId)

  try {
    // Realizar la eliminación en la base de datos
    const [result] = await pool.query('DELETE FROM notes WHERE nota_id = ?', [noteId]);

    if (result.affectedRows > 0) {
      res.status(200).send({ message: 'Nota eliminada con éxito' });
    } else {
      res.status(404).send({ error: 'Nota no encontrada' });
    }
  } catch (error) {
    console.error('Error al eliminar la nota', error);
    res.status(500).send({ error: 'Error interno del servidor' });
  }
}