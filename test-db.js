const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'tawabil_db'
    });
    console.log('Successfully connected to the database!');
    const [rows] = await connection.execute('SHOW TABLES');
    console.log('Tables:', rows);
    await connection.end();
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
  }
}

testConnection();
