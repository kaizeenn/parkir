const express = require('express');
const router = express.Router();
const Model_Users = require('../model/Model_Users');

// Tampilkan daftar user
router.get('/', (req, res) => {
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
