const express = require('express');
const router = express.Router();
const Model_Kendaraan = require('../model/Model_Kendaraan');

// List semua kendaraan
router.get('/', (req, res) => {
    Model_Kendaraan.getAll((err, results) => {
        if (err) {
            console.error(err);
            return res.render('kendaraan/index', { kendaraan: [], messages: { error: 'Gagal ambil data' } });
        }
        res.render('kendaraan/index', { kendaraan: results, messages: {} });
    });
});

// Tampilkan form tambah kendaraan
router.get('/add', (req, res) => {
    res.render('kendaraan/add');
});

// Proses simpan kendaraan
router.post('/add', (req, res) => {
    const data = {
        plat_nomor: req.body.plat_nomor,
        jenis: req.body.jenis,
        pemilik: req.body.pemilik
    };
    Model_Kendaraan.store(data, (err) => {
        if (err) {
            console.error(err);
            req.flash('error', 'Gagal simpan data');
            return res.redirect('/kendaraan/add');
        }
        req.flash('success', 'Kendaraan berhasil ditambahkan');
        res.redirect('/kendaraan');
    });
});

// Hapus kendaraan
router.get('/delete/:id', (req, res) => {
    Model_Kendaraan.delete(req.params.id, (err) => {
        if (err) {
            req.flash('error', 'Gagal hapus data');
            return res.redirect('/kendaraan');
        }
        req.flash('success', 'Kendaraan berhasil dihapus');
        res.redirect('/kendaraan');
    });
});

module.exports = router;
