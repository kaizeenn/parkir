const express = require('express');
const router = express.Router();
const Model_Users = require('../model/Model_Users');

// GET /auth/login - Render login page
router.get('/login', (req, res) => {
    if (req.session.user) {
        return res.redirect('/dashboard');
    }
    res.render('auth/login', { messages: res.locals.messages });
});

// POST /auth/login - Process login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    Model_Users.login(email, password, (err, user) => {
        if (err) {
            console.error(err);
            req.flash('error', 'Terjadi kesalahan server');
            return res.redirect('/auth/login');
        }

        if (!user) {
            req.flash('error', 'Email atau password salah');
            return res.redirect('/auth/login');
        }

        req.session.user = user;
        req.flash('success', 'Login berhasil');

        if (user.role === 'superadmin') {
            res.redirect('/superadmin/dashboard');
        } else if (user.role === 'admin') {
            res.redirect('/admin/dashboard');
        } else {
            res.redirect('/users/dashboard');
        }
    });
});

// GET /auth/register - Render registration page
router.get('/register', (req, res) => {
    if (req.session.user) {
        return res.redirect('/dashboard');
    }
    res.render('auth/register', { messages: res.locals.messages });
});

// POST /auth/register - Process registration
router.post('/register', async (req, res) => {
    const { nama, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        req.flash('error', 'Password dan konfirmasi password tidak cocok');
        return res.redirect('/auth/register');
    }

    Model_Users.checkEmailExists(email, (err, exists) => {
        if (err) {
            console.error(err);
            req.flash('error', 'Terjadi kesalahan server');
            return res.redirect('/auth/register');
        }

        if (exists) {
            req.flash('error', 'Email sudah terdaftar');
            return res.redirect('/auth/register');
        }

        const data = {
            nama,
            email,
            password,
            role: 'admin' // default role for new users
        };

        Model_Users.store(data, (err) => {
            if (err) {
                console.error(err);
                req.flash('error', 'Gagal mendaftar');
                return res.redirect('/auth/register');
            }
            req.flash('success', 'Pendaftaran berhasil, silakan login');
            res.redirect('/auth/login');
        });
    });
});

// GET /auth/logout - Logout user
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
        }
        res.redirect('/auth/login');
    });
});

module.exports = router;
