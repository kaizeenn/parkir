var express = require('express');
var router = express.Router();

// Redirect to login if not authenticated, else to dashboard
router.get('/', (req, res) => {
    if (req.session.user) {
        res.redirect('/dashboard');
    } else {
        res.redirect('/auth/login');
    }
});

// Dashboard route to redirect based on role
router.get('/dashboard', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }
    const user = req.session.user;
    if (user.role === 'superadmin') {
        res.redirect('/superadmin/dashboard');
    } else if (user.role === 'admin') {
        res.redirect('/admin/dashboard');
    } else {
        res.redirect('/users');
    }
});

module.exports = router;
