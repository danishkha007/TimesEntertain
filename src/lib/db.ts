import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Function to create the slugify function in the database if it doesn't exist.
async function createSlugifyFunction() {
  const connection = await pool.getConnection();
  try {
    // This query creates a slugify function within MySQL.
    // It's designed to be idempotent (it won't fail if the function already exists).
    await connection.query(`
      CREATE FUNCTION IF NOT EXISTS slugify(str TEXT)
      RETURNS TEXT
      DETERMINISTIC
      NO SQL
      BEGIN
          DECLARE lower_str TEXT;
          DECLARE result TEXT;
          SET lower_str = LOWER(str);
          -- Replace spaces with hyphens
          SET result = REPLACE(lower_str, ' ', '-');
          -- Remove all non-alphanumeric characters except hyphens
          -- This requires a more complex loop in MySQL, but for most cases a simple replace works.
          -- A more robust solution might involve a stored procedure or multiple REPLACE calls.
          -- For now, this will handle the most common cases.
          -- Let's add more replaces for common special characters.
          SET result = REPLACE(result, ':', '');
          SET result = REPLACE(result, '\'', '');
          SET result = REPLACE(result, '"', '');
          SET result = REPLACE(result, '?', '');
          SET result = REPLACE(result, '&', 'and');
          SET result = REPLACE(result, '.', '');
          SET result = REPLACE(result, ',', '');
          -- Replace multiple hyphens with a single one
          WHILE (result LIKE '%--%') DO
              SET result = REPLACE(result, '--', '-');
          END WHILE;
          RETURN result;
      END;
    `);
  } catch (error) {
    console.error('Failed to create slugify function:', error);
  } finally {
    connection.release();
  }
}

// Call the function to ensure slugify exists in the DB.
createSlugifyFunction();


export default pool;
