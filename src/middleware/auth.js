// middleware/auth.js
import jwt from 'jsonwebtoken'
// const jwt = require('jsonwebtoken');

export const authenticateToken  = (req, res, next) => {
  const token = req.headers['authorization'];
  let idUsBody
  idUsBody = req.query.user_id
  // console.log('idUsBody arriba del if: ',idUsBody)
  
 if(!idUsBody){
  idUsBody = req.body.user_id
  // console.log('dentro del if')

 }
    
  // console.log(req.body.user_id)

  if (!token) {
    // console.log('idUsBody: ',idUsBody)
    return res.status(401).json({ error: 'No autorizado' });
  }

  jwt.verify(token, 'takeNote', (err, user) => {
    const userId = user.user_id
    console.log('iserid: ',userId)
    console.log('idUsBody: ',idUsBody)
    if (err ) {
      return res.status(403).json({ error: 'Token inválido' });
      
    }else if(idUsBody != userId){
      return res.status(403).json({ error: 'Token inválido id' });
    }
    // console.log('auth', userId)
    // console.log('idUsBody' ,idUsBody)
    // if(idUsBody != userId){
    //   return res.status(403).json({ error: 'Token inválido id' });
    // }
    console.log('auth', userId)

    req.user = user;
    next();
  });
}
