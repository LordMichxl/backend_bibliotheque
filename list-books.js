import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const listBooks = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'library_db',
    });

    const [books] = await connection.execute('SELECT id, title, author, isbn, description, quantity, available_quantity FROM books');
    console.log('Books in database:', books);

    await connection.end();
  } catch (error) {
    console.error('Error listing books:', error.message);
  }
};

listBooks();