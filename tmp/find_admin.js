const mysql = require('mysql2/promise');

async function getAdmin() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'tawabil_db'
    });
    const [rows] = await connection.execute('SELECT * FROM admin');
    console.log('Admins:', rows);
    await connection.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

getAdmin();
