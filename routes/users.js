const express = require('express');
const router = express.Router();
const Model_Users = require('../model/Model_Users');
const { requireAuth, requireRole } = require('../middleware/roleMiddleware');

// Tampilkan daftar user (hanya superadmin)
router.get('/', requireAuth, requireRole(['superadmin']), (req, res) => {
    Model_Users.getAll((err, results) => {
        if (err) {
            console.error(err);
            return res.render('users/index', {
                users: [],
                messages: { error: 'Gagal mengambil data user' }
            });
        }
        res.render('users/index', {
            users: results,
            messages: {}
        });
    });
});

module.exports = router;
