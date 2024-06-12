const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const authVerify = require('./middlewares/authVerify');
const userAuthRoutes = require('./routes/auth/userAuth');
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const photographerRoutes = require('./routes/photographerRoutes');
const guestRoutes = require('./routes/guestRoutes');
const adminAuthRoutes = require('./routes/auth/adminAuth');
const dashboardRoutes = require('./routes/dashboardRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const home_404 = require('./routes/404');

const app = express();
dotenv.config();

//************************Morgan************************//
// require('./utils/logReports/logger')(app);

//************************Database-Connection************************//
require('./config/db.config').connect();

app.use(cors())
// console.log("destination",path.join(__dirname, './public'))
app.use(express.static(path.join(__dirname, './public/dist')));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'uploads')));


app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/user/auth', userAuthRoutes);

app.use('/api/dashboard', authVerify, dashboardRoutes);
app.use('/api/user', authVerify, userRoutes);
app.use('/api/event', authVerify, eventRoutes);
app.use('/api/photographer', authVerify, photographerRoutes);
app.use('/api/guest', guestRoutes);

app.use('/api/payment', paymentRoutes);

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/dist', 'index.html'));
});

// Middleware to catch request aborted errors
app.use((err, req, res, next) => {
    if (err && err.message === 'request aborted') {
        // Handle the aborted request here, e.g., log it or send a custom response.
        res.status(400).send('Request aborted.');
    } else {
        console.log("next")
        next(err); // Pass other errors to the default error handler
    }
});

app.use(home_404);

app.listen(process.env.PORT, (err) => {
    if(!err){
        console.log(`Server is running on port ${process.env.PORT}`)
    }else{
        console.log("error:-", err)
    }
})
