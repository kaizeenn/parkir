const db = require('../config/database');

const Model_Kendaraan = {
    // Ambil semua kendaraan
    getAll: (callback) => {
        const sql = 'SELECT * FROM kendaraan ORDER BY id DESC';
        db.query(sql, callback);
    },

    // Ambil 1 kendaraan by ID
    getById: (id, callback) => {
        const sql = 'SELECT * FROM kendaraan WHERE id = ?';
        db.query(sql, [id], callback);
    },

    // Tambah kendaraan
    store: (data, callback) => {
        const sql = 'INSERT INTO kendaraan (plat_nomor, jenis, pemilik) VALUES (?, ?, ?)';
        db.query(sql, [data.plat_nomor, data.jenis, data.pemilik], callback);
    },

    // Update kendaraan
    update: (id, data, callback) => {
        const sql = 'UPDATE kendaraan SET plat_nomor = ?, jenis = ?, pemilik = ? WHERE id = ?';
        db.query(sql, [data.plat_nomor, data.jenis, data.pemilik, id], callback);
    },

    // Hapus kendaraan
    delete: (id, callback) => {
        const sql = 'DELETE FROM kendaraan WHERE id = ?';
        db.query(sql, [id], callback);
    }
};

module.exports = Model_Kendaraan;
