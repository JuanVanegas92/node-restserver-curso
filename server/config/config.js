// ===============================================
//  PUERTO
// ===============================================
process.env.PORT = process.env.PORT || 3000;

// ===============================================
//  ENTORNO
// ===============================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ===============================================
//  Vencimiento del Token
// ===============================================
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// ===============================================
//  SEED de autenticacion
// ===============================================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';


// ===============================================
//  BASE DE DATOS  'este-es-el-seed-produccion'
// ===============================================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

// ===============================================
//  Google Client ID
// ===============================================
process.env.CLIENT_ID = process.env.CLIENT_ID || '500631047037-fde0kppkcnobgq13a556a3914cnro37r.apps.googleusercontent.com';