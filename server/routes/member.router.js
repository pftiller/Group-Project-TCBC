const express = require('express');
const encryptLib = require('../modules/encryption');
const userStrategy = require('../strategies/sql.localstrategy');
const pool = require('../modules/pool.js');
const router = express.Router();

router.get('/viewProfile', function (req, res) {
    if (isAuthenticated()) {
      // console.log('in get event');
      const queryText =
      `SELECT 
      member_id, 
      membership_start, 
      membership_expiration, 
      first_name, 
      middle_name, 
      last_name, 
      city, 
      state,
      zip, 
      gender, 
      phone_1, 
      phone_2, 
      email
      FROM member_info
      WHERE member_id = $1`;
      pool.query(queryText, [req.params.id])
        .then((result) => {
          // console.log('query results:', result);
          res.send(result);
        })
        .catch((err) => {
          // console.log('error making query:', err);
          res.sendStatus(500);
        });
    }
  });


module.exports = router;