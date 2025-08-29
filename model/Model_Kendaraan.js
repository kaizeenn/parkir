const db = require('../config/database');

const Model_Kendaraan = {
    // Ambil semua kendaraan dengan join ke users dan tarif
    getAll: (callback) => {
        const sql = `
            SELECT k.*, u.nama as nama_petugas, t.harga, t.waktu 
            FROM kendaraan k 
            LEFT JOIN users u ON k.id_users = u.id 
            LEFT JOIN tarif t ON k.id_tarif = t.id 
            ORDER BY k.id DESC
        `;
        db.query(sql, callback);
    },

    // Ambil 1 kendaraan by ID dengan join
    getById: (id, callback) => {
        const sql = `
            SELECT k.*, u.nama as nama_petugas, t.harga, t.waktu, t.tipe as tipe_tarif 
            FROM kendaraan k 
            LEFT JOIN users u ON k.id_users = u.id 
            LEFT JOIN tarif t ON k.id_tarif = t.id 
            WHERE k.id = ?
        `;
        db.query(sql, [id], callback);
    },

    // Ambil kendaraan yang masih parkir (status = 'in')
    getParked: (callback) => {
        const sql = 'SELECT * FROM kendaraan WHERE status = "in" ORDER BY jam_masuk DESC';
        db.query(sql, callback);
    },

    // Ambil kendaraan berdasarkan plat nomor
    getByPlat: (no_plat, callback) => {
        const sql = 'SELECT * FROM kendaraan WHERE no_plat = ?';
        db.query(sql, [no_plat], callback);
    },

    // Tambah kendaraan (parkir masuk)
    store: (data, callback) => {
        const sql = 'INSERT INTO kendaraan (foto, no_plat, type, warna, jam_masuk, status, id_users, id_tarif) VALUES (?, ?, ?, ?, NOW(), "in", ?, ?)';
        db.query(sql, [data.foto, data.no_plat, data.type, data.warna, data.id_users, data.id_tarif], callback);
    },

    // Update kendaraan
    update: (id, data, callback) => {
        const sql = 'UPDATE kendaraan SET foto = ?, no_plat = ?, type = ?, warna = ?, id_users = ?, id_tarif = ? WHERE id = ?';
        db.query(sql, [data.foto, data.no_plat, data.type, data.warna, data.id_users, data.id_tarif, id], callback);
    },

    // Proses keluar kendaraan (update status dan jam_keluar)
    checkout: (id, callback) => {
        const sql = 'UPDATE kendaraan SET status = "out", jam_keluar = NOW() WHERE id = ?';
        db.query(sql, [id], callback);
    },

    // Hapus kendaraan
    delete: (id, callback) => {
        const sql = 'DELETE FROM kendaraan WHERE id = ?';
        db.query(sql, [id], callback);
    },

    // Hitung total kendaraan parkir
    countParked: (callback) => {
        const sql = 'SELECT COUNT(*) as total FROM kendaraan WHERE status = "in"';
        db.query(sql, callback);
    },

    // Hitung total pendapatan hari ini
    getTodayRevenue: (callback) => {
        const sql = `
            SELECT SUM(t.harga) as total_pendapatan 
            FROM kendaraan k 
            JOIN tarif t ON k.id_tarif = t.id 
            WHERE DATE(k.jam_keluar) = CURDATE() AND k.status = "out"
        `;
        db.query(sql, callback);
    }
};

module.exports = Model_Kendaraan;
