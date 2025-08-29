const db = require('../config/database');

const Model_Pengunjung = {
    // Ambil semua pengunjung
    getAll: (callback) => {
        const sql = `
            SELECT p.*, k.no_plat, k.type as jenis_kendaraan 
            FROM pengunjung p 
            LEFT JOIN kendaraan k ON p.id_kendaraan = k.id 
            ORDER BY p.id DESC
        `;
        db.query(sql, callback);
    },

    // Ambil pengunjung by ID
    getById: (id, callback) => {
        const sql = `
            SELECT p.*, k.no_plat, k.type as jenis_kendaraan 
            FROM pengunjung p 
            LEFT JOIN kendaraan k ON p.id_kendaraan = k.id 
            WHERE p.id = ?
        `;
        db.query(sql, [id], callback);
    },

    // Ambil pengunjung by kendaraan ID
    getByKendaraanId: (id_kendaraan, callback) => {
        const sql = 'SELECT * FROM pengunjung WHERE id_kendaraan = ?';
        db.query(sql, [id_kendaraan], callback);
    },

    // Tambah pengunjung
    store: (data, callback) => {
        const sql = 'INSERT INTO pengunjung (wajah, pakaian, keterangan, id_kendaraan) VALUES (?, ?, ?, ?)';
        db.query(sql, [data.wajah, data.pakaian, data.keterangan, data.id_kendaraan], callback);
    },

    // Update pengunjung
    update: (id, data, callback) => {
        const sql = 'UPDATE pengunjung SET wajah = ?, pakaian = ?, keterangan = ?, id_kendaraan = ? WHERE id = ?';
        db.query(sql, [data.wajah, data.pakaian, data.keterangan, data.id_kendaraan, id], callback);
    },

    // Hapus pengunjung
    delete: (id, callback) => {
        const sql = 'DELETE FROM pengunjung WHERE id = ?';
        db.query(sql, [id], callback);
    },

    // Hapus pengunjung by kendaraan ID
    deleteByKendaraanId: (id_kendaraan, callback) => {
        const sql = 'DELETE FROM pengunjung WHERE id_kendaraan = ?';
        db.query(sql, [id_kendaraan], callback);
    }
};

module.exports = Model_Pengunjung;
