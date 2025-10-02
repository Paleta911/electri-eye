// const jwt = require('jsonwebtoken');
// const { getDB } = require('../utils/mongo');

// // Cambia esta clave si la tienes en otro archivo o en variables de entorno
// const JWT_SECRET = 'clave-super-secreta';

// /**
//  * Middleware para validar token y cargar datos del usuario.
//  */
// async function verificarToken(req, res, next) {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) {
//     return res.status(401).json({ message: 'Token requerido' });
//   }

//   const token = authHeader.split(' ')[1];
//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);

//     const db = getDB();
//     const user = await db.collection('users').findOne({ username: decoded.username });

//     if (!user) {
//       return res.status(401).json({ message: 'Usuario no encontrado' });
//     }

//     req.user = {
//       username: user.username,
//       role: user.role,
//       servicioActivo: user.servicioActivo === true
//     };

//     console.log(`✅ Token verificado para usuario: ${user.username}`);
//     next();
//   } catch (err) {
//     console.error('❌ Error al verificar token:', err);
//     return res.status(403).json({ message: 'Token inválido o expirado' });
//   }
// }

// /**
//  * Middleware adicional para exigir que la cuenta esté activada.
//  */
// function requireCuentaActiva(req, res, next) {
//   if (!req.user || !req.user.servicioActivo) {
//     return res.status(403).json({ message: 'Cuenta no activada. Ingresa tu clave de activación.' });
//   }
//   next();
// }

// /**
//  * Middleware adicional para exigir rol admin.
//  */
// function requireAdmin(req, res, next) {
//   if (!req.user || req.user.role !== 'admin') {
//     return res.status(403).json({ message: 'Acceso denegado. Rol de administrador requerido.' });
//   }
//   next();
// }




// module.exports = {
//   verificarToken,
//   requireCuentaActiva,
//   requireAdmin,
//   JWT_SECRET
// };



const jwt = require('jsonwebtoken');
const { getDB } = require('../utils/mongo');

// Cambia esta clave si la tienes en otro archivo o en variables de entorno
const JWT_SECRET = 'clave-super-secreta';

/**
 * Middleware para validar token y cargar datos del usuario.
 */
async function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Token requerido.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const db = getDB();
    const user = await db.collection('users').findOne({ email: decoded.email });

    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado.' });
    }

    req.user = {
      email: user.email,
      role: user.role,
      servicioActivo: user.servicioActivo === true
    };

    console.log(`✅ Token verificado para email: ${user.email}`);
    next();
  } catch (err) {
    console.error('❌ Error al verificar token:', err);
    return res.status(403).json({ message: 'Token inválido o expirado.' });
  }
}

/**
 * Middleware adicional para exigir que la cuenta esté activada.
 */
function requireCuentaActiva(req, res, next) {
  if (!req.user || !req.user.servicioActivo) {
    return res.status(403).json({ message: 'Cuenta no activada. Ingresa tu clave de activación.' });
  }
  next();
}

/**
 * Middleware adicional para exigir rol admin.
 */
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado. Rol de administrador requerido.' });
  }
  next();
}

module.exports = {
  verificarToken,
  requireCuentaActiva,
  requireAdmin,
  JWT_SECRET
};
