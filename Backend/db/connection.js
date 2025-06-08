const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root1234',
  database: 'mi_base_datos',
  multipleStatements: true 
});
db.connect(err => {
    if (err) throw err;
    console.log('Conectado a la db')
});

module.exports = db;
