let mysql = require('mysql');

let connection = mysql.createConnection({
    host: '127.0.0.1',    // ← pakai IPv4 agar tidak ke ::1
    user: 'root',
    password: '1234',
    database: 'parkir_db'
});

connection.connect(function(err) {
    if (err) {
        console.error('Error connecting to the database: ' + err.stack);
        return;
    }
    console.log('Connected to the database as id ' + connection.threadId);
});

module.exports = connection;
