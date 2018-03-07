const express = require('express');
const encryptLib = require('../modules/encryption');
const userStrategy = require('../strategies/sql.localstrategy');
const isAuthenticated = require('../modules/isAuthenticated');
const pool = require('../modules/pool.js');
const router = express.Router();

router.get('/viewProfile', isAuthenticated, function (req, res) {
  console.log('in viewProfile event');
  console.log('this is the user', req.user);
  const queryText =
    `SELECT *
      FROM member_info
      WHERE member_id = $1`;
  pool.query(queryText, [req.user.member_id])
    .then((result) => {
      console.log('query results:', result.rows);
      res.send(result.rows);
    })
    .catch((err) => {
      console.log('error making query:', err);
      res.sendStatus(500);
    });
});


module.exports = router;