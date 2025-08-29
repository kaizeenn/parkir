const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middleware/roleMiddleware');
const Model_Pengunjung = require('../model/Model_Pengunjung');
const Model_Kendaraan = require('../model/Model_Kendaraan');
const Model_Users = require('../model/Model_Users');

// Admin dashboard route
router.get('/dashboard', requireAuth, requireRole(['admin']), (req, res) => {
    res.render('admin/dashboard', { user: req.session.user });
});

// Route to add visitor form
router.get('/pengunjung/add', requireAuth, requireRole(['admin']), (req, res) => {
    res.render('admin/add_pengunjung', { user: req.session.user });
});

// Route to add visitor
router.post('/pengunjung/add', requireAuth, requireRole(['admin']), (req, res) => {
    const data = req.body;
    Model_Pengunjung.store(data, (err) => {
        if (err) {
            req.flash('error', 'Gagal menambah pengunjung');
            return res.redirect('/admin/pengunjung/add');
        }
        req.flash('success', 'Pengunjung berhasil ditambahkan');
        res.redirect('/admin/dashboard');
    });
});

// Route to add vehicle form
router.get('/kendaraan/add', requireAuth, requireRole(['admin']), (req, res) => {
    res.render('admin/add_kendaraan', { user: req.session.user });
});

// Route to add vehicle
router.post('/kendaraan/add', requireAuth, requireRole(['admin']), (req, res) => {
    const data = req.body;
    Model_Kendaraan.store(data, (err) => {
        if (err) {
            req.flash('error', 'Gagal menambah kendaraan');
            return res.redirect('/admin/kendaraan/add');
        }
        req.flash('success', 'Kendaraan berhasil ditambahkan');
        res.redirect('/admin/dashboard');
    });
});

// Route to change password form
router.get('/change-password', requireAuth, requireRole(['admin']), (req, res) => {
    res.render('admin/change_password', { user: req.session.user });
});

// Route to change password
router.post('/change-password', requireAuth, requireRole(['admin']), async (req, res) => {
    const userId = req.session.user.id;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
        req.flash('error', 'Password baru dan konfirmasi tidak cocok');
        return res.redirect('/admin/change-password');
    }

    Model_Users.getById(userId, async (err, user) => {
        if (err || !user) {
            req.flash('error', 'User tidak ditemukan');
            return res.redirect('/admin/change-password');
        }

        const bcrypt = require('bcrypt');
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            req.flash('error', 'Password lama salah');
            return res.redirect('/admin/change-password');
        }

        Model_Users.update(userId, { password: newPassword }, (err) => {
            if (err) {
                req.flash('error', 'Gagal mengubah password');
                return res.redirect('/admin/change-password');
            }
            req.flash('success', 'Password berhasil diubah');
            res.redirect('/admin/dashboard');
        });
    });
});

module.exports = router;
