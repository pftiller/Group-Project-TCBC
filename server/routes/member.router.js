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
    id,
    role_name
    FROM 
    user_roles
    ORDER BY 
    id ASC`;
  pool.query(queryText)
    .then((result) => {
      console.log('query get user role results:', result.rows);
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
    `SELECT * 
    FROM users 
    JOIN user_roles 
    ON users.role = user_roles.id
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


router.put(`/changeRole/:member_id`, isAuthenticated, function (req, res) {
  console.log('in change role router');
  let memID = req.params.member_id;
  const queryText =
    `UPDATE users
  SET role = $1
  WHERE member_id = $2;`
  pool.query(queryText, [req.body.id, memID])
    .then((result) => {
      console.log('query results for change user role ', result.rows);
      console.log('req.body.id', req.body.id);
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log('error changing user role:', err);
      res.sendStatus(500);
    })
})

router.get(`/adminViewMemberPastRides/:member_id`, isAuthenticated, function (req, res) {
  console.log('in past rides router');
  let memberID = req.params.member_id;
  const queryText = `
    SELECT * 
    FROM rides
    JOIN rides_users on rides_users.ride_id = rides.id
    WHERE rides_users.user_id = $1
    AND rides.completed = true
    AND rides.cancelled = false
    AND rides.approved = true;`
  pool.query(queryText, [memberID])
    .then((result) => {
      console.log('query results for past rides ', result.rows);
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log('error getting user past rides ', err);
      res.sendStatus(500);
    })

})






// router.get('/member/pastRideDetails', isAuthenticated, (req, res) => {
//   const allRidesQuery = `SELECT * FROM rides
//   JOIN rides_users on rides_users.ride_id = rides.id
//   WHERE rides_users.user_id = $1
//   AND rides.completed = true
//   AND rides.cancelled = false
//   AND rides.approved = true;`
//   pool.query(allRidesQuery, [req.user.id])
//       .then((result) => {
//           console.log('past rides ', result.rows);
//           res.send(result.rows);
//       })
//       .catch((err) => {
//           console.log('error getting all my past rides', err);

//       })
// });

module.exports = router;