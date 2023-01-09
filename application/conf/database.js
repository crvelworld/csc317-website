//Module to export databse to other files (Not optimized)
const mysql = require('mysql2');

const pool = mysql.createPool({ 
host: 'localhost',
user: 'root',
password: 'LanaDelRey4?',
database: 'csc317db',
connectionLimit: 20,
waitForConnections: true,
queueLimit: 0
});

module.exports = pool.promise();