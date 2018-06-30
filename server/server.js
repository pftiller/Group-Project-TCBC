const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var pg = require('pg');
const passport = require('./strategies/sql.localstrategy');
const sessionConfig = require('./modules/session-middleware');

// Route includes
const userRouter = require('./routes/user.router');
const ridesRouter = require('./routes/rides.router');
const memberRouter = require('./routes/member.router');
const userUploader = require('./routes/upload.router');


// Serve static files
app.use(express.static('server/public'));

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Passport Session Configuration
app.use(sessionConfig);

// Start up passport sessions
app.use(passport.initialize());
app.use(passport.session());

/* Routes */
app.use('/api/user', userRouter);
app.use('/rides', ridesRouter);
app.use('/member', memberRouter);
app.use('/upload', userUploader);

var connection = mysql.createConnection({
    host     : process.env.RDS_HOSTNAME,
    user     : process.env.RDS_USERNAME,
    password : process.env.RDS_PASSWORD,
    port     : process.env.RDS_PORT
  });
  
/** Listen * */
connection.connect(function(err) {
    if (err) {
      console.error('Database connection failed: ' + err.stack);
      return;
    }
  
    console.log('Connected to database.');
  });
  
  connection.end();






