var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var encryptLib = require('../modules/encryption');
var pool = require('../modules/pool.js');

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  pool.connect(function (err, client, release) {
    if (err) {
      console.log('connection err ', err);
      release();
      done(err);
    }

    var user = {};

    client.query("SELECT * FROM users WHERE id = $1", [id], function (err, result) {
      if (err) {
        console.log('query err ', err);
        done(err);
        release();
      }

      user = result.rows[0];
      release();

      if (!user) {
        // user not found
        return done(null, false, {
          message: 'Incorrect credentials.'
        });
      } else {
        // user found
        //   ('User row ', user);
        done(null, user);
      }

    });
  });
});

// Does actual work of logging in
passport.use('local', new localStrategy({
  passReqToCallback: true,
  usernameField: 'member_id'
}, function (req, member_id, password, done) {
  pool.connect(function (err, client, release) {
    // assumes the username will be unique, thus returning 1 or 0 results
    client.query("SELECT * FROM users WHERE member_id = $1", [member_id],
      function (err, result) {
        var user = {};
        // Handle Errors
        if (err) {
          console.log('connection err ', err);
          done(null, user);
        }

        release();
        if (result.rows[0] != undefined) {
          user = result.rows[0];
          if (encryptLib.comparePassword(password, user.password)) {
            done(null, user);
          } else {
            console.log('password does not match');
            done(null, false, {
              message: 'Incorrect credentials.'
            });
          }
        } else {
          console.log('no user');
          done(null, false);
        }

      });
  });
}));

module.exports = passport;