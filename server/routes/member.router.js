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

router.get('/userRole', isAuthenticated, function (req, res) {
  console.log('in get user role router');
  const queryText =
    `SELECT
    role_name
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

router.get('/findRider/riderInfo/:first_name/:last_name/:member_id', isAuthenticated, function (req, res) {
  console.log('in find rider router');
  console.log(req.body);
  console.log(req.params); 
  console.log('req.params for rider search ', req.params.member_id);
  const queryText =
    `SELECT 
    first_name,
    last_name,
    member_id,
    role_name
    FROM
    users
    WHERE member_id = $1
    OR first_name = $2
    OR last_name = $3;`
  pool.query(queryText, [req.params.member_id, req.params.first_name, req.params.last_name])
    .then((result) => {
      console.log('query results for rider search:', result.rows);
      res.send(result.rows);
    })
    .catch((err) => {
      console.log('error making member search query:', err);
      res.sendStatus(500);
    });
});

router.put(`/changeRole/:member_id`, isAuthenticated, function (req,res) {
  console.log('in change role router');
  let memID = req.params.member_id;
  console.log(req.body.role_name, memID);
  const queryText =
  `UPDATE users
  SET role_name = $1
  WHERE member_id = $2`
  pool.query(queryText, [req.body.role_name, memID])
  .then((result)=>{
    console.log('query results for change user role ', result.rows);
    res.send(201);
  })
  .catch((err)=> {
    console.log('error changing user role:', err);
    res.sendStatus(500);
  })
})


module.exports = router;