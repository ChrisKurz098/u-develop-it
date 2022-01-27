const mysql = require('mysql2');

const db = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '(Bd2%)~5-k',
        database: 'election'
    },
    console.log('Connected to the election database.')
);

module.exports = db;