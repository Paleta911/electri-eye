// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const speakeasy = require('speakeasy');
// const qrcode = require('qrcode');
// const { ObjectId } = require('mongodb');
// const { getDB } = require('../utils/mongo');
// const { JWT_SECRET } = require('../middlewares/authMiddleware');

// const CLAVE_SIMPLE = '12345678';

// /**
//  * Login con usuario o email y contraseña
//  */
// async function login(req, res) {
//   try {
//     const { username, email, password } = req.body;
//     if ((!username && !email) || !password) {
//       return res.status(400).json({ message: 'Campos requeridos' });
//     }

//     const db = getDB();
//     const usersCollection = db.collection('users');

//     // Buscar por username o email
//     const query = username
//       ? { username }
//       : { email };

//     const user = await usersCollection.findOne(query);
//     if (!user) {
//       return res.status(401).json({ message: 'Usuario o correo no encontrado' });
//     }

//     const hashed = user.passwordHash || user.password;
//     if (!hashed) {
//       console.error('El usuario no tiene campo de contraseña:', user);
//       return res.status(500).json({ message: 'El usuario no tiene contraseña almacenada.' });
//     }

//     const isValid = await bcrypt.compare(password, hashed);
//     if (!isValid) {
//       return res.status(401).json({ message: 'Contraseña incorrecta' });
//     }

//     // Si tiene 2FA habilitado
//     if (user.twofa?.enabled && user.twofa.secret) {
//       const tempToken = jwt.sign(
//         { username: user.username, role: user.role || 'user' },
//         JWT_SECRET,
//         { expiresIn: '5m' }
//       );
//       return res.json({ message: '2FA requerido', twofa_required: true, tempToken });
//     }

//     // Token normal
//     const token = jwt.sign(
//       { username: user.username, role: user.role || 'user' },
//       JWT_SECRET,
//       { expiresIn: '2h' }
//     );

//     res.json({
//   message: 'Inicio de sesión exitoso',
//   token,
//   role: user.role || 'user',
//   servicioActivo: user.servicioActivo === true
// });
   
//   } catch (error) {
//     console.error('❌ Error en login:', error);
//     res.status(500).json({ message: 'Error interno del servidor.' });
//   }
// }

// /**
//  * Verificar token 2FA
//  */
// async function verify2FA(req, res) {
//   const { tempToken, token } = req.body;
//   if (!tempToken || !token) {
//     return res.status(400).json({ message: 'Datos requeridos' });
//   }

//   const decoded = jwt.verify(tempToken, JWT_SECRET);
//   const username = decoded.username;

//   const db = getDB();
//   const user = await db.collection('users').findOne({ username });
//   if (!user?.twofa?.enabled || !user.twofa.secret) {
//     return res.status(400).json({ message: '2FA no configurado.' });
//   }

//   const valid = speakeasy.totp.verify({
//     secret: user.twofa.secret,
//     encoding: 'base32',
//     token,
//     window: 0
//   });

//   if (!valid) {
//     return res.status(401).json({ message: 'Código inválido o expirado.' });
//   }

//   const jwtToken = jwt.sign(
//     { username, role: user.role || 'user' },
//     JWT_SECRET,
//     { expiresIn: '2h' }
//   );

//   res.json({ message: '2FA verificado', token: jwtToken, role: user.role || 'user' });
// }

// /**
//  * Estado de 2FA
//  */
// async function twofaStatus(req, res) {
//   const username = req.user.username;
//   const db = getDB();
//   const user = await db.collection('users').findOne({ username });
//   res.json({ enabled: !!(user?.twofa?.enabled && user?.twofa.secret) });
// }

// /**
//  * Activar 2FA
//  */
// async function activate2FA(req, res) {
//   const username = req.user.username;
//   const db = getDB();
//   const secret = speakeasy.generateSecret({ name: ElectricEye ($,{username}) });

//   await db.collection('users').updateOne(
//     { username },
//     { $set: { 'twofa.tempSecret': secret.base32 } }
//   );

//   qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
//     if (err) return res.status(500).json({ message: 'Error generando QR' });
//     res.json({ qr: data_url });
//   });
// }

// /**
//  * Confirmar 2FA
//  */
// async function confirm2FA(req, res) {
//   const username = req.user.username;
//   const { token } = req.body;
//   if (!token) {
//     return res.status(400).json({ message: 'Código requerido.' });
//   }

//   const db = getDB();
//   const user = await db.collection('users').findOne({ username });
//   const tempSecret = user?.twofa?.tempSecret;
//   if (!tempSecret) {
//     return res.status(400).json({ message: 'No hay activación pendiente.' });
//   }

//   const verified = speakeasy.totp.verify({
//     secret: tempSecret,
//     encoding: 'base32',
//     token,
//     window: 0
//   });

//   if (!verified) {
//     return res.status(400).json({ message: 'Código inválido o expirado.' });
//   }

//   await db.collection('users').updateOne(
//     { username },
//     {
//       $set: { 'twofa.enabled': true, 'twofa.secret': tempSecret },
//       $unset: { 'twofa.tempSecret': '' }
//     }
//   );

//   res.json({ message: '2FA activado correctamente.' });
// }

// /**
//  * Desactivar 2FA
//  */
// async function deactivate2FA(req, res) {
//   const username = req.user.username;
//   const db = getDB();
//   await db.collection('users').updateOne(
//     { username },
//     { $unset: { twofa: '' } }
//   );
//   res.json({ message: '2FA desactivado.' });
// }

// /**
//  * Registro de usuarios
//  */
// async function register(req, res) {
//   const { username, email, password, role } = req.body;
//   if (!username || !email || !password || !role) {
//     return res.status(400).json({ message: 'Todos los campos son requeridos' });
//   }

//   if (!['user', 'admin'].includes(role)) {
//     return res.status(400).json({ message: 'Rol inválido.' });
//   }

//   const db = getDB();

//   // Verificar duplicados
//   const existingUser = await db.collection('users').findOne({
//     $or: [{ username }, { email }]
//   });
//   if (existingUser) {
//     return res.status(409).json({ message: 'El usuario o correo ya están registrados.' });
//   }

//   const hashedPassword = await bcrypt.hash(password, 10);
//   const result = await db.collection('users').insertOne({
//     username,
//     email,
//     passwordHash: hashedPassword,
//     role,
//     servicioActivo: false,
//     estadoCuenta: 'REGISTRADO',
//     claveActivacionUsada: null,
//     twoFactorSecret: null,
//     createdAt: new Date()
//   });

//   res.json({ message: 'Usuario registrado', id: result.insertedId });
// }

// /**
//  * Login con clave simple
//  */
// function loginClave(req, res) {
//   const { clave } = req.body;
//   if (typeof clave !== 'string' || clave.trim() !== CLAVE_SIMPLE) {
//     return res.status(401).json({ message: 'Clave incorrecta' });
//   }
//   res.json({ message: 'Clave correcta' });
// }


// /**
//  * Verificar si la sesión está activa y devolver servicioActivo
//  */
// async function verificarSesion(req, res) {
//   const username = req.user.username;

//   const db = getDB();
//   const user = await db.collection('users').findOne({ username });

//   if (!user) {
//     return res.status(404).json({ message: 'Usuario no encontrado' });
//   }

//   res.json({
//     username: user.username,
//     servicioActivo: user.servicioActivo === true
//   });
// }



// module.exports = {
//   login,
//   verify2FA,
//   twofaStatus,
//   activate2FA,
//   confirm2FA,
//   deactivate2FA,
//   register,
//   loginClave,
//   verificarSesion
// };





const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const { getDB } = require('../utils/mongo');
const { JWT_SECRET } = require('../middlewares/authMiddleware');

const CLAVE_SIMPLE = '12345678';

/**
 * Login con email y contraseña
 */
// async function login(req, res) {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) {
//       return res.status(400).json({ message: 'Email y contraseña son requeridos.' });
//     }

//     const db = getDB();
//     const user = await db.collection('users').findOne({ email });
//     if (!user) {
//       return res.status(401).json({ message: 'Correo no encontrado.' });
//     }

//     const hashed = user.passwordHash || user.password;
//     if (!hashed) {
//       console.error('El usuario no tiene contraseña almacenada:', user);
//       return res.status(500).json({ message: 'El usuario no tiene contraseña almacenada.' });
//     }

//     const isValid = await bcrypt.compare(password, hashed);
//     if (!isValid) {
//       return res.status(401).json({ message: 'Contraseña incorrecta' });
//     }

//     // Si tiene 2FA habilitado
//     if (user.twofa?.enabled && user.twofa.secret) {
//       const tempToken = jwt.sign(
//         { email: user.email, role: user.role || 'user' },
//         JWT_SECRET,
//         { expiresIn: '5m' }
//       );
//       return res.json({ message: '2FA requerido', twofa_required: true, tempToken });
//     }

//     // Token normal
//     const token = jwt.sign(
//       { email: user.email, role: user.role || 'user' },
//       JWT_SECRET,
//       { expiresIn: '2h' }
//     );

//     res.json({
//       message: 'Inicio de sesión exitoso',
//       token,
//       role: user.role || 'user',
//       servicioActivo: user.servicioActivo === true
//     });

//   } catch (error) {
//     console.error('❌ Error en login:', error);
//     res.status(500).json({ message: 'Error interno del servidor.' });
//   }
// }




async function login(req, res) {
  try {
    const { email, phone, password } = req.body;
    if ((!email && !phone) || !password) {
      return res.status(400).json({ message: 'Email o teléfono y contraseña son requeridos.' });
    }

    const db = getDB();
    let query = {};

    if (email) {
      query = { email };
    } else if (phone) {
      query = { phone };
    }

    const user = await db.collection('users').findOne(query);
    if (!user) {
      return res.status(401).json({ message: 'Correo o teléfono no encontrado.' });
    }

    const hashed = user.passwordHash || user.password;
    if (!hashed) {
      console.error('El usuario no tiene campo de contraseña:', user);
      return res.status(500).json({ message: 'El usuario no tiene contraseña almacenada.' });
    }

    const isValid = await bcrypt.compare(password, hashed);
    if (!isValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta.' });
    }

    // Si tiene 2FA habilitado
    if (user.twofa?.enabled && user.twofa.secret) {
      const tempToken = jwt.sign(
        { email: user.email, phone: user.phone, role: user.role || 'user' },
        JWT_SECRET,
        { expiresIn: '5m' }
      );
      return res.json({ message: '2FA requerido', twofa_required: true, tempToken });
    }

    // Token normal
    const token = jwt.sign(
      { email: user.email, phone: user.phone, role: user.role || 'user' },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      role: user.role || 'user',
      servicioActivo: user.servicioActivo === true
    });
  } catch (error) {
    console.error('❌ Error en login:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
}


/**
 * Verificar token 2FA
 */
async function verify2FA(req, res) {
  const { tempToken, token } = req.body;
  if (!tempToken || !token) {
    return res.status(400).json({ message: 'Datos requeridos.' });
  }

  const decoded = jwt.verify(tempToken, JWT_SECRET);
  const email = decoded.email;

  const db = getDB();
  const user = await db.collection('users').findOne({ email });
  if (!user?.twofa?.enabled || !user.twofa.secret) {
    return res.status(400).json({ message: '2FA no configurado.' });
  }

  const valid = speakeasy.totp.verify({
    secret: user.twofa.secret,
    encoding: 'base32',
    token,
    window: 0
  });

  if (!valid) {
    return res.status(401).json({ message: 'Código inválido o expirado.' });
  }

  const jwtToken = jwt.sign(
    { email, role: user.role || 'user' },
    JWT_SECRET,
    { expiresIn: '2h' }
  );

  res.json({ message: '2FA verificado', token: jwtToken, role: user.role || 'user' });
}

/**
 * Estado de 2FA
 */
async function twofaStatus(req, res) {
  const email = req.user.email;
  const db = getDB();
  const user = await db.collection('users').findOne({ email });
  res.json({ enabled: !!(user?.twofa?.enabled && user?.twofa.secret) });
}

/**
 * Activar 2FA
 */
async function activate2FA(req, res) {
  const email = req.user.email;
  const db = getDB();
  const secret = speakeasy.generateSecret({ name: `ElectricEye (${email})` });

  await db.collection('users').updateOne(
    { email },
    { $set: { 'twofa.tempSecret': secret.base32 } }
  );

  qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
    if (err) return res.status(500).json({ message: 'Error generando QR' });
    res.json({ qr: data_url });
  });
}

/**
 * Confirmar 2FA
 */
async function confirm2FA(req, res) {
  const email = req.user.email;
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ message: 'Código requerido.' });
  }

  const db = getDB();
  const user = await db.collection('users').findOne({ email });
  const tempSecret = user?.twofa?.tempSecret;
  if (!tempSecret) {
    return res.status(400).json({ message: 'No hay activación pendiente.' });
  }

  const verified = speakeasy.totp.verify({
    secret: tempSecret,
    encoding: 'base32',
    token,
    window: 0
  });

  if (!verified) {
    return res.status(400).json({ message: 'Código inválido o expirado.' });
  }

  await db.collection('users').updateOne(
    { email },
    {
      $set: { 'twofa.enabled': true, 'twofa.secret': tempSecret },
      $unset: { 'twofa.tempSecret': '' }
    }
  );

  res.json({ message: '2FA activado correctamente.' });
}

/**
 * Desactivar 2FA
 */
async function deactivate2FA(req, res) {
  const email = req.user.email;
  const db = getDB();
  await db.collection('users').updateOne(
    { email },
    { $unset: { twofa: '' } }
  );
  res.json({ message: '2FA desactivado.' });
}

/**
 * Registro de usuarios
 */
async function register(req, res) {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Todos los campos son requeridos.' });
  }

  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Rol inválido.' });
  }

  const db = getDB();

  const existingUser = await db.collection('users').findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: 'El correo ya está registrado.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await db.collection('users').insertOne({
    email,
    passwordHash: hashedPassword,
    role,
    servicioActivo: false,
    estadoCuenta: 'REGISTRADO',
    claveActivacionUsada: null,
    twoFactorSecret: null,
    createdAt: new Date()
  });

  res.json({ message: 'Usuario registrado.', id: result.insertedId });
}

/**
 * Login con clave simple
 */
function loginClave(req, res) {
  const { clave } = req.body;
  if (typeof clave !== 'string' || clave.trim() !== CLAVE_SIMPLE) {
    return res.status(401).json({ message: 'Clave incorrecta.' });
  }
  res.json({ message: 'Clave correcta.' });
}

/**
 * Verificar si la sesión está activa y devolver servicioActivo
 */
async function verificarSesion(req, res) {
  const email = req.user.email;

  const db = getDB();
  const user = await db.collection('users').findOne({ email });

  if (!user) {
    return res.status(404).json({ message: 'Usuario no encontrado.' });
  }

  res.json({
    email: user.email,
    servicioActivo: user.servicioActivo === true
  });
}

module.exports = {
  login,
  verify2FA,
  twofaStatus,
  activate2FA,
  confirm2FA,
  deactivate2FA,
  register,
  loginClave,
  verificarSesion
};

