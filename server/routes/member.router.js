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

router.get('/searchMember', isAuthenticated, function (req, res) {
  console.log('in search member event');
  const queryText =
    `SELECT 
    member_id,
    first_name,
    last_name,
    role
    FROM
    users
    WHERE first_name = $1
    OR last_name = $2
    OR member_id = $3`;
  pool.query(queryText, [req.user])
    .then((result) => {
      console.log('query results:', result.rows);
      res.send(result.rows);
    })
    .catch((err) => {
      console.log('error making query:', err);
      res.sendStatus(500);
    });
});

router.get('/userRole', isAuthenticated, function (req, res) {
  console.log('in get user role router');
  const queryText =
    `SELECT
    role
    FROM 
    user_roles 
    ORDER BY 
    id ASC`;
  pool.query(queryText)
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