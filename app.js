const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('express-flash');
const methodOverride = require('method-override');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session & Flash
app.use(session({
    secret: 'secret123',
    resave: false,
    saveUninitialized: true
}));
app.use(flash());

// Expose flash ke view
app.use((req, res, next) => {
    res.locals.messages = {
        success: req.flash('success'),
        error: req.flash('error')
    };
    res.locals.session = req.session;
    next();
});

// Routes
const usersRoute = require('./routes/users');  
const indexRoute = require('./routes/index'); 
const kendaraanRoute = require('./routes/kendaraan');
const authRoute = require('./routes/auth');
const adminRoute = require('./routes/admin');
const superadminRoute = require('./routes/superadmin');

app.use('/kendaraan', kendaraanRoute);
app.use('/auth', authRoute);
app.use('/admin', adminRoute);
app.use('/superadmin', superadminRoute);
app.use('/', indexRoute);
app.use('/users', usersRoute);

// Root
app.get('/', (req, res) => {
    res.redirect('/users');
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
