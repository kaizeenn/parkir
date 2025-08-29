module.exports = {
    requireAuth: (req, res, next) => {
        if (req.session.user) {
            next();
        } else {
            req.flash('error', 'Silakan login terlebih dahulu');
            res.redirect('/auth/login');
        }
    },

    requireRole: (roles) => {
        return (req, res, next) => {
            if (req.session.user && roles.includes(req.session.user.role)) {
                next();
            } else {
                req.flash('error', 'Akses ditolak. Anda tidak memiliki izin untuk mengakses halaman ini');
                res.redirect('/auth/login');
            }
        };
    }
};
