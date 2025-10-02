// const express = require('express');
// const router = express.Router();
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const { getDB } = require('../utils/mongo');
// const { verificarToken } = require('../middlewares/authMiddleware');

// const JWT_SECRET = 'clave-super-secreta';

// /**
//  * POST /api/usuarios/registrar
//  * Registrar un usuario nuevo
//  */
// router.post('/registrar', async (req, res) => {
//   try {
//     const { username, email, password } = req.body;

//     if (!username || !email || !password) {
//       return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
//     }

//     const db = getDB();
//     const existe = await db.collection('users').findOne({
//       $or: [{ email }, { username }]
//     });

//     if (existe) {
//       return res.status(400).json({ message: 'El usuario o email ya existe.' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     await db.collection('users').insertOne({
//       username,
//       email,
//       passwordHash: hashedPassword,
//       servicioActivo: false,
//       estadoCuenta: 'REGISTRADO',
//       claveActivacionUsada: null,
//       role: 'user',
//       createdAt: new Date()
//     });

//     const token = jwt.sign(
//       { username, role: 'user' },
//       JWT_SECRET,
//       { expiresIn: '2h' }
//     );

//     console.log(`🆕 Usuario registrado y logueado automáticamente: ${username}`);

//     res.status(201).json({
//       message: 'Usuario registrado correctamente.',
//       token,
//       servicioActivo: false
//     });
//   } catch (error) {
//     console.error('❌ Error al registrar usuario:', error);
//     res.status(500).json({ message: 'Error al registrar usuario.' });
//   }
// });

// /**
//  * POST /api/usuarios/activar
//  * Activar servicio con clave
//  */
// router.post('/activar', async (req, res) => {
//   try {
//     const { username, clave } = req.body;

//     if (!username || !clave) {
//       return res.status(400).json({ message: 'Faltan datos.' });
//     }

//     const db = getDB();
//     const usuario = await db.collection('users').findOne({ username });
//     if (!usuario) {
//       return res.status(404).json({ message: 'Usuario no encontrado.' });
//     }

//     if (usuario.servicioActivo) {
//       return res.status(400).json({ message: 'El servicio ya está activado.' });
//     }

//     const claveDoc = await db.collection('activationkeys').findOne({ clave });
//     if (!claveDoc) {
//       return res.status(400).json({ message: 'Clave no válida.' });
//     }

//     if (claveDoc.usada) {
//       return res.status(400).json({ message: 'La clave ya fue usada.' });
//     }

//     // Activar el servicio
//     await db.collection('users').updateOne(
//       { username },
//       {
//         $set: {
//           servicioActivo: true,
//           estadoCuenta: 'ACTIVO',
//           claveActivacionUsada: clave
//         }
//       }
//     );

//     // Marcar la clave como usada
//     await db.collection('activationkeys').updateOne(
//       { clave },
//       { $set: { usada: true } }
//     );

//     console.log(`✅ Usuario ${username} activó el servicio con clave ${clave}`);

//     res.status(200).json({ message: 'Servicio activado correctamente.' });
//   } catch (error) {
//     console.error('❌ Error al activar servicio:', error);
//     res.status(500).json({ message: 'Error al activar servicio.' });
//   }
// });

// /**
//  * GET /api/usuarios/me
//  * Obtener datos del usuario autenticado
//  */
// router.get('/me', verificarToken, async (req, res) => {
//   try {
//     const db = getDB();
//     const username = req.user.username;

//     const usuario = await db.collection('users').findOne({ username });
//     if (!usuario) {
//       return res.status(404).json({ message: 'Usuario no encontrado.' });
//     }

//     res.json({
//       username: usuario.username,
//       email: usuario.email,
//       servicioActivo: usuario.servicioActivo,
//       estadoCuenta: usuario.estadoCuenta
//     });
//   } catch (error) {
//     console.error('❌ Error al obtener datos del usuario:', error);
//     res.status(500).json({ message: 'Error interno del servidor.' });
//   }
// });

// /**
//  * GET /api/usuarios/verificar-sesion
//  * Verificar si la sesión está activa y servicioActivo
//  */
// router.get('/verificar-sesion', verificarToken, async (req, res) => {
//   try {
//     const db = getDB();
//     const username = req.user.username;

//     const usuario = await db.collection('users').findOne({ username });
//     if (!usuario) {
//       return res.status(404).json({ message: 'Usuario no encontrado.' });
//     }

//     res.json({
//       username: usuario.username,
//       servicioActivo: usuario.servicioActivo === true
//     });
//   } catch (error) {
//     console.error('❌ Error al verificar sesión:', error);
//     res.status(500).json({ message: 'Error interno del servidor.' });
//   }
// });


// module.exports = router;






const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getDB } = require('../utils/mongo');
const { verificarToken } = require('../middlewares/authMiddleware');

const JWT_SECRET = 'clave-super-secreta';

/**
 * POST /api/usuarios/registrar
 * Registrar un usuario nuevo
 */
// router.post('/registrar', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ message: 'Email y contraseña son obligatorios.' });
//     }

//     const db = getDB();
//     const existe = await db.collection('users').findOne({ email });

//     if (existe) {
//       return res.status(400).json({ message: 'El email ya está registrado.' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     await db.collection('users').insertOne({
//       email,
//       passwordHash: hashedPassword,
//       servicioActivo: false,
//       estadoCuenta: 'REGISTRADO',
//       claveActivacionUsada: null,
//       role: 'user',
//       createdAt: new Date()
//     });

//     const token = jwt.sign(
//       { email, role: 'user' },
//       JWT_SECRET,
//       { expiresIn: '2h' }
//     );

//     console.log(`🆕 Usuario registrado y logueado automáticamente: ${email}`);

//     res.status(201).json({
//       message: 'Usuario registrado correctamente.',
//       token,
//       servicioActivo: false
//     });
//   } catch (error) {
//     console.error('❌ Error al registrar usuario:', error);
//     res.status(500).json({ message: 'Error al registrar usuario.' });
//   }
// });

// /**
//  * POST /api/usuarios/activar
//  * Activar servicio con clave
//  */
// /**
//  * POST /api/usuarios/activar
//  * Activar servicio con clave
//  */
// router.post('/activar', verificarToken, async (req, res) => {
//   try {
//     const email = req.user.email; // 💡 Lo toma del token
//     const { clave } = req.body;

//     if (!clave) {
//       return res.status(400).json({ message: 'La clave es requerida.' });
//     }

//     const db = getDB();
//     const usuario = await db.collection('users').findOne({ email });
//     if (!usuario) {
//       return res.status(404).json({ message: 'Usuario no encontrado.' });
//     }

//     if (usuario.servicioActivo) {
//       return res.status(400).json({ message: 'El servicio ya está activado.' });
//     }

//     const claveDoc = await db.collection('activationkeys').findOne({ clave });
//     if (!claveDoc) {
//       return res.status(400).json({ message: 'Clave no válida.' });
//     }

//     if (claveDoc.usada) {
//       return res.status(400).json({ message: 'La clave ya fue usada.' });
//     }

//     // Activar el servicio
//     await db.collection('users').updateOne(
//       { email },
//       {
//         $set: {
//           servicioActivo: true,
//           estadoCuenta: 'ACTIVO',
//           claveActivacionUsada: clave
//         }
//       }
//     );

//     // Marcar la clave como usada
//     await db.collection('activationkeys').updateOne(
//       { clave },
//       { $set: { usada: true } }
//     );

//     console.log(`✅ Usuario ${email} activó el servicio con clave ${clave}`);

//     res.status(200).json({ message: 'Servicio activado correctamente.' });
//   } catch (error) {
//     console.error('❌ Error al activar servicio:', error);
//     res.status(500).json({ message: 'Error al activar servicio.' });
//   }
// });



/**
 * POST /api/usuarios/registrar
 * Registrar un usuario nuevo
 */
router.post('/registrar', async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    if (!email || !phone || !password) {
      return res.status(400).json({ message: 'Email, teléfono y contraseña son obligatorios.' });
    }

    const db = getDB();

    // Verificar duplicados por email o teléfono
    const existe = await db.collection('users').findOne({
      $or: [{ email }, { phone }]
    });

    if (existe) {
      return res.status(400).json({ message: 'El email o teléfono ya está registrado.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.collection('users').insertOne({
      email,
      phone,
      passwordHash: hashedPassword,
      servicioActivo: false,
      estadoCuenta: 'REGISTRADO',
      claveActivacionUsada: null,
      role: 'user',
      createdAt: new Date()
    });

    const token = jwt.sign(
      { email, role: 'user' },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    console.log(`🆕 Usuario registrado y logueado automáticamente: ${email}`);

    res.status(201).json({
      message: 'Usuario registrado correctamente.',
      token,
      servicioActivo: false
    });
  } catch (error) {
    console.error('❌ Error al registrar usuario:', error);
    res.status(500).json({ message: 'Error al registrar usuario.' });
  }
});


/**
 * POST /api/usuarios/activar
 * Activar servicio con clave
 */
router.post('/activar', verificarToken, async (req, res) => {
  try {
    const email = req.user.email; // ⚠️ Lo toma del token
    const { clave } = req.body;

    if (!clave) {
      return res.status(400).json({ message: 'La clave es requerida.' });
    }

    const db = getDB();
    const usuario = await db.collection('users').findOne({ email });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    if (usuario.servicioActivo) {
      return res.status(400).json({ message: 'El servicio ya está activado.' });
    }

    const claveDoc = await db.collection('activationkeys').findOne({ clave });
    if (!claveDoc) {
      return res.status(400).json({ message: 'Clave no válida.' });
    }

    if (claveDoc.usada) {
      return res.status(400).json({ message: 'La clave ya fue usada.' });
    }

    // Activar el servicio
    await db.collection('users').updateOne(
      { email },
      {
        $set: {
          servicioActivo: true,
          estadoCuenta: 'ACTIVO',
          claveActivacionUsada: clave
        }
      }
    );

    // Marcar la clave como usada
    await db.collection('activationkeys').updateOne(
      { clave },
      { $set: { usada: true } }
    );

    console.log(`✅ Usuario ${email} activó el servicio con clave ${clave}`);
    res.status(200).json({ message: 'Servicio activado correctamente.' });
  } catch (error) {
    console.error('❌ Error al activar servicio:', error);
    res.status(500).json({ message: 'Error al activar servicio.' });
  }
});



/**
 * GET /api/usuarios/me
 * Obtener datos del usuario autenticado
 */
router.get('/me', verificarToken, async (req, res) => {
  try {
    const db = getDB();
    const email = req.user.email;

    const usuario = await db.collection('users').findOne({ email });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    res.json({
      email: usuario.email,
      servicioActivo: usuario.servicioActivo,
      estadoCuenta: usuario.estadoCuenta
    });
  } catch (error) {
    console.error('❌ Error al obtener datos del usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

/**
 * GET /api/usuarios/verificar-sesion
 * Verificar si la sesión está activa y servicioActivo
 */
router.get('/verificar-sesion', verificarToken, async (req, res) => {
  try {
    const db = getDB();
    const email = req.user.email;

    const usuario = await db.collection('users').findOne({ email });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    res.json({
      email: usuario.email,
      servicioActivo: usuario.servicioActivo === true
    });
  } catch (error) {
    console.error('❌ Error al verificar sesión:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

module.exports = router;
