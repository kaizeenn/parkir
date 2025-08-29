const db = require('../config/database');

const Model_Tarif = {
    // Ambil semua tarif
    getAll: (callback) => {
        const sql = 'SELECT * FROM tarif ORDER BY id DESC';
        db.query(sql, callback);
    },

    // Ambil tarif by ID
    getById: (id, callback) => {
        const sql = 'SELECT * FROM tarif WHERE id = ?';
        db.query(sql, [id], callback);
    },

    // Ambil tarif by tipe kendaraan
    getByTipe: (tipe, callback) => {
        const sql = 'SELECT * FROM tarif WHERE tipe = ?';
        db.query(sql, [tipe], callback);
    },

    // Tambah tarif
    store: (data, callback) => {
        const sql = 'INSERT INTO tarif (harga, waktu, tipe) VALUES (?, ?, ?)';
        db.query(sql, [data.harga, data.waktu, data.tipe], callback);
    },

    // Update tarif
    update: (id, data, callback) => {
        const sql = 'UPDATE tarif SET harga = ?, waktu = ?, tipe = ? WHERE id = ?';
        db.query(sql, [data.harga, data.waktu, data.tipe, id], callback);
    },

    // Hapus tarif
    delete: (id, callback) => {
        const sql = 'DELETE FROM tarif WHERE id = ?';
        db.query(sql, [id], callback);
    }
};

module.exports = Model_Tarif;
