const db = require('../config/database');
const bcrypt = require('bcrypt');

const Model_Users = {
    // Ambil semua user
    getAll: (callback) => {
        const sql = 'SELECT id, nama, email, role FROM users ORDER BY id DESC';
        db.query(sql, callback);
    },

    // Ambil user by ID
    getById: (id, callback) => {
        const sql = 'SELECT id, nama, email, role FROM users WHERE id = ?';
        db.query(sql, [id], callback);
    },

    // Ambil user by email
    getByEmail: (email, callback) => {
        const sql = 'SELECT * FROM users WHERE email = ?';
        db.query(sql, [email], callback);
    },

    // Hitung total user
    count: (callback) => {
        const sql = 'SELECT COUNT(*) as total FROM users';
        db.query(sql, callback);
    },

    // Tambah user (Register)
    store: async (data, callback) => {
        try {
            const hashedPassword = await bcrypt.hash(data.password, 10);
            const sql = 'INSERT INTO users (nama, email, password, role) VALUES (?, ?, ?, ?)';
            db.query(sql, [data.nama, data.email, hashedPassword, data.role || 'admin'], callback);
        } catch (err) {
            callback(err);
        }
    },

    // Update user (termasuk password jika diubah)
    update: async (id, data, callback) => {
        try {
            if (data.password) {
                const hashedPassword = await bcrypt.hash(data.password, 10);
                const sql = 'UPDATE users SET nama = ?, email = ?, password = ?, role = ? WHERE id = ?';
                db.query(sql, [data.nama, data.email, hashedPassword, data.role, id], callback);
            } else {
                const sql = 'UPDATE users SET nama = ?, email = ?, role = ? WHERE id = ?';
                db.query(sql, [data.nama, data.email, data.role, id], callback);
            }
        } catch (err) {
            callback(err);
        }
    },

    // Update profile tanpa password
    updateProfile: (id, data, callback) => {
        const sql = 'UPDATE users SET nama = ?, email = ? WHERE id = ?';
        db.query(sql, [data.nama, data.email, id], callback);
    },

    // Hapus user
    delete: (id, callback) => {
        const sql = 'DELETE FROM users WHERE id = ?';
        db.query(sql, [id], callback);
    },

    // Login user
    login: (email, password, callback) => {
        const sql = 'SELECT * FROM users WHERE email = ?';
        db.query(sql, [email], async (err, results) => {
            if (err) return callback(err);
            if (results.length === 0) return callback(null, null);

            const user = results[0];
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return callback(null, null);

            // Hapus password dari object user sebelum dikembalikan
            delete user.password;
            callback(null, user);
        });
    },

    // Cek apakah email sudah terdaftar
    checkEmailExists: (email, callback) => {
        const sql = 'SELECT COUNT(*) as count FROM users WHERE email = ?';
        db.query(sql, [email], (err, results) => {
            if (err) return callback(err);
            callback(null, results[0].count > 0);
        });
    }
};

module.exports = Model_Users;
