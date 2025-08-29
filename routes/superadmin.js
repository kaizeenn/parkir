const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middleware/roleMiddleware');
const Model_Kendaraan = require('../model/Model_Kendaraan');
const Model_Users = require('../model/Model_Users');
const Model_Tarif = require('../model/Model_Tarif');
const Model_Pengunjung = require('../model/Model_Pengunjung');

// Superadmin dashboard route
router.get('/dashboard', requireAuth, requireRole(['superadmin']), (req, res) => {
    res.render('superadmin/dashboard', { user: req.session.user });
});

// Route to view revenue report
router.get('/revenue', requireAuth, requireRole(['superadmin']), (req, res) => {
    Model_Kendaraan.getTodayRevenue((err, results) => {
        if (err) {
            req.flash('error', 'Gagal mengambil data pendapatan');
            return res.redirect('/superadmin/dashboard');
        }
        const totalRevenue = results[0].total_pendapatan || 0;
        res.render('superadmin/revenue', { user: req.session.user, totalRevenue });
    });
});

// Route to view all users (manage accounts)
router.get('/users', requireAuth, requireRole(['superadmin']), (req, res) => {
    Model_Users.getAll((err, users) => {
        if (err) {
            req.flash('error', 'Gagal mengambil data user');
            return res.redirect('/superadmin/dashboard');
        }
        res.render('superadmin/users', { user: req.session.user, users });
    });
});

// Route to edit user form
router.get('/users/edit/:id', requireAuth, requireRole(['superadmin']), (req, res) => {
    const userId = req.params.id;
    Model_Users.getById(userId, (err, user) => {
        if (err || !user) {
            req.flash('error', 'User tidak ditemukan');
            return res.redirect('/superadmin/users');
        }
        res.render('superadmin/edit_user', { user: req.session.user, editUser: user });
    });
});

// Route to update user
router.post('/users/edit/:id', requireAuth, requireRole(['superadmin']), (req, res) => {
    const userId = req.params.id;
    const data = req.body;
    Model_Users.update(userId, data, (err) => {
        if (err) {
            req.flash('error', 'Gagal mengupdate user');
            return res.redirect(`/superadmin/users/edit/${userId}`);
        }
        req.flash('success', 'User berhasil diupdate');
        res.redirect('/superadmin/users');
    });
});

// Route to view tariffs
router.get('/tarif', requireAuth, requireRole(['superadmin']), (req, res) => {
    Model_Tarif.getAll((err, tarifs) => {
        if (err) {
            req.flash('error', 'Gagal mengambil data tarif');
            return res.redirect('/superadmin/dashboard');
        }
        res.render('superadmin/tarif', { user: req.session.user, tarifs });
    });
});

// Route to add tariff form
router.get('/tarif/add', requireAuth, requireRole(['superadmin']), (req, res) => {
    res.render('superadmin/add_tarif', { user: req.session.user });
});

// Route to add tariff
router.post('/tarif/add', requireAuth, requireRole(['superadmin']), (req, res) => {
    const data = req.body;
    Model_Tarif.store(data, (err) => {
        if (err) {
            req.flash('error', 'Gagal menambah tarif');
            return res.redirect('/superadmin/tarif/add');
        }
        req.flash('success', 'Tarif berhasil ditambahkan');
        res.redirect('/superadmin/tarif');
    });
});

// Route to edit tariff form
router.get('/tarif/edit/:id', requireAuth, requireRole(['superadmin']), (req, res) => {
    const tarifId = req.params.id;
    Model_Tarif.getById(tarifId, (err, tarif) => {
        if (err || !tarif) {
            req.flash('error', 'Tarif tidak ditemukan');
            return res.redirect('/superadmin/tarif');
        }
        res.render('superadmin/edit_tarif', { user: req.session.user, editTarif: tarif });
    });
});

// Route to update tariff
router.post('/tarif/edit/:id', requireAuth, requireRole(['superadmin']), (req, res) => {
    const tarifId = req.params.id;
    const data = req.body;
    Model_Tarif.update(tarifId, data, (err) => {
        if (err) {
            req.flash('error', 'Gagal mengupdate tarif');
            return res.redirect(`/superadmin/tarif/edit/${tarifId}`);
        }
        req.flash('success', 'Tarif berhasil diupdate');
        res.redirect('/superadmin/tarif');
    });
});

// Route to add visitor form
router.get('/pengunjung/add', requireAuth, requireRole(['superadmin']), (req, res) => {
    res.render('superadmin/add_pengunjung', { user: req.session.user });
});

// Route to add visitor
router.post('/pengunjung/add', requireAuth, requireRole(['superadmin']), (req, res) => {
    const data = req.body;
    Model_Pengunjung.store(data, (err) => {
        if (err) {
            req.flash('error', 'Gagal menambah pengunjung');
            return res.redirect('/superadmin/pengunjung/add');
        }
        req.flash('success', 'Pengunjung berhasil ditambahkan');
        res.redirect('/superadmin/dashboard');
    });
});

// Route to add vehicle form
router.get('/kendaraan/add', requireAuth, requireRole(['superadmin']), (req, res) => {
    res.render('superadmin/add_kendaraan', { user: req.session.user });
});

// Route to add vehicle
router.post('/kendaraan/add', requireAuth, requireRole(['superadmin']), (req, res) => {
    const data = req.body;
    Model_Kendaraan.store(data, (err) => {
        if (err) {
            req.flash('error', 'Gagal menambah kendaraan');
            return res.redirect('/superadmin/kendaraan/add');
        }
        req.flash('success', 'Kendaraan berhasil ditambahkan');
        res.redirect('/superadmin/dashboard');
    });
});

module.exports = router;
