
// import mysql from 'mysql2/promise';

// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

// // Function to create the slugify function in the database if it doesn't exist.
// async function createSlugifyFunction() {
//   let connection;
//   try {
//     connection = await pool.getConnection();
//     // This query creates a slugify function within MySQL.
//     // It's designed to be idempotent (it won't fail if the function already exists).
//     await connection.query(`
//       CREATE FUNCTION IF NOT EXISTS slugify(dirty_string text)
//       RETURNS text
//       DETERMINISTIC
//       BEGIN
//           DECLARE x, y, z text;
//           DECLARE p, last_p INT;
//           SET z = 'abcdefghijklmnopqrstuvwxyz0123456789-';
//           SET x = LOWER(dirty_string);
//           SET x = REPLACE(x, ' ', '-');

//           SET p = 1;
//           SET y = '';
//           REPEAT
//               SET last_p = p;
//               SET p = LOCATE(SUBSTRING(x, last_p, 1), z);
//               IF p > 0 THEN
//                   SET y = CONCAT(y, SUBSTRING(x, last_p, 1));
//               END IF;
//               SET p = last_p + 1;
//           UNTIL p > CHAR_LENGTH(x) END REPEAT;
          
//           WHILE (y LIKE '%--%') DO
//               SET y = REPLACE(y, '--', '-');
//           END WHILE;

//           IF y LIKE '-%' THEN
//               SET y = SUBSTRING(y, 2);
//           END IF;
//           IF y LIKE '%-' THEN
//               SET y = SUBSTRING(y, 1, CHAR_LENGTH(y) - 1);
//           END IF;
          
//           RETURN y;
//       END
//     `);
//   } catch (error) {
//     console.error('Failed to create slugify function:', error);
//     // We don't want to throw here as it might crash the app on startup
//   } finally {
//     if (connection) {
//       connection.release();
//     }
//   }
// }

// // Call the function to ensure slugify exists in the DB.
// createSlugifyFunction();


// export default pool;
