const express = require('express');
const encryptLib = require('../modules/encryption');
const userStrategy = require('../strategies/sql.localstrategy');
const isAuthenticated = require('../modules/isAuthenticated');
const pool = require('../modules/pool.js');
const router = express.Router();

router.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(req.user);
  } else {
    res.sendStatus(403);
  }
});

router.post('/register', (req, res, next) => {
  const member_id = req.body.member_id;
  const password = encryptLib.encryptPassword(req.body.password);
  var saveUser = {
    member_id: req.body.member_id,
    password: encryptLib.encryptPassword(req.body.password)
  };
  const role = 1;
  const queryCheckMemberTable = `
  SELECT * FROM member_info
  WHERE member_id = $1;`
  pool.query(queryCheckMemberTable, [member_id])
    .then((result) => {
      if (result.rows.length > 0) {
        saveUser.first_name = result.rows[0].first_name;
        saveUser.last_name = result.rows[0].last_name;
        saveUser.phone_1 = result.rows[0].phone_1;
        saveUser.email = result.rows[0].email;
        const queryUserTableForMember = `
          SELECT * FROM users
          WHERE member_id = $1;`
        pool.query(queryUserTableForMember, [member_id])
          .then((result) => {
            if (result.rows.length > 0) {
              res.send('Member number already has an account!<br> If you need to reset your password<br> contact a system administrator.')
            } else {
              pool.query('INSERT INTO users (member_id, password, role, first_name, last_name, phone_1, email) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id', [saveUser.member_id, saveUser.password, role, saveUser.first_name, saveUser.last_name, saveUser.phone_1, saveUser.email], (err, result) => {
                if (err) {
                  res.sendStatus(500);
                } else {
                  res.send('Registration succesful! You may now log in.');
                }
              });
            }
          })
          .catch((err) => {
            console.log('error finding users member info ', err);
            res.sendStatus(500);
          })
      } else {
           ('No member number found in member_info!');
        res.send('No membership information found<br> for this member number. To become <br> a member of TCBC go here...')
      }
    })
    .catch((err) => {
         ('error finding member_info member info ', err);
      res.sendStatus(500);
    })
});

router.post('/login', userStrategy.authenticate('local'), (req, res) => {
  res.sendStatus(200);
});

router.get('/logout', (req, res) => {
  req.logout();
  res.sendStatus(200);
});

router.post('/admin/changePassword', isAuthenticated, (req, res) => {
  let newPassword = encryptLib.encryptPassword(req.body.newPassword);
  let userId = req.body.user_id;

  const changePasswordQuery = `
    UPDATE users
    SET password = $1
    WHERE id = $2`;
  pool.query(changePasswordQuery, [newPassword, userId])
    .then((result) => {
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log('password change failed: ', err);
      res.sendStatus(500);
    })

})

module.exports = router;