import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const listMembers = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'library_db',
    });

    const [rows] = await connection.execute('SELECT id, first_name, last_name, email FROM members');
    console.log('Members in database:', rows);

    await connection.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
};

listMembers();