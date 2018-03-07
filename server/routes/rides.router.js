const express = require('express');
const router = express.Router();
const isAuthenticated = require('../modules/isAuthenticated');
const pool = require('../modules/pool');
const ridePackager = require('../modules/ridePackager.module');



        /* GET all Approved rides*/ 
router.get('/public/details',  (req, res) => {

    const allRidesQuery = `SELECT rides.id AS ride_id, array_agg(rides_distances.distance) AS ride_distance, array_agg(rides_distances.id) AS ride_distance_id, rides.rides_name,rides.rides_date,rides.description,rides.url,rides.ride_location, rides.ride_leader,rides.approved,rides.completed,rides.cancelled, users.first_name, users.last_name,users.phone_1,users.email
    FROM rides 
    JOIN rides_distances on rides.id = rides_distances.ride_id
    JOIN users on rides.ride_leader = users.id
    WHERE approved = true
    GROUP BY rides.id, users.first_name, users.last_name, users.phone_1,users.email`;

    pool.query(allRidesQuery)
        .then((result) => {
            console.log('get rides ', result.rows);
            let formattedRides = ridePackager(result.rows);
            res.send(formattedRides);
        })
        .catch((err) => {
            console.log('error getting all rides', err);

        })
});

//get my rides only
//need to specify columns to get
router.get('/member/rideDetails', (req, res) => {
    const allRidesQuery = `SELECT * FROM rides
    JOIN rides_users on rides_users.ride_id = rides.id
    WHERE user_id = $1;`
    pool.query(allRidesQuery, [req.user.id])
        .then((result) => {
            console.log('rides ', result.rows);
            res.send(result.rows);
        })
        .catch((err) => {
            console.log('error getting all my rides', err);

        })

});

// get riders for check in view
router.get(`/rideLeader/signedUpRiders/:rideId`, (req, res) => {
    const queryText = `
    SELECT * FROM users
    JOIN rides_users on rides_users.user_id = users.id
    WHERE rides_users.ride_id = $1;`
    pool.query(queryText, [req.params.rideId])
        .then((result) => {
            console.log('user infos ', result.rows);
            res.send(result.rows);
        })
        .catch((err) => {
            console.log('error getting users for ride check in', err);

        })

});

/* GET All Categories */
router.get('/public/categories', (req, res) => {
    //res.send(categories);
    const CategoryQuery = `SELECT * FROM categories`;
    pool.query(CategoryQuery)
        .then((result) => {
            res.send(result.rows);
        })
        .catch((err) => {
            console.log('Error getting categories');
            res.sendStatus(500);
        })
});

//ride post to sign up
//add validation if user has already signed up?
//primary key was finickey
router.post('/signUp', isAuthenticated, (req, res) => {
    console.log('user ', req.user);
    console.log('req.body ', req.body);
    const query = `
    INSERT INTO rides_users (ride_id, user_id, selected_distance) 
    VALUES ($1, $2, $3)`;
    pool.query(query, [req.body.ride_id, req.user.id, req.body.selected_distance])
        .then((result) => {
            res.sendStatus(201);
        })
        // error handling
        .catch((err) => {
            console.log('error making insert query:', err);
            res.sendStatus(500);
        });
});


// unregsiter member for ride
//delete rides_users row where userid and ride id are equal
router.delete('/unregister/:ride_id/', isAuthenticated, (req, res) => {
    console.log('user ', req.user);
    console.log('ride_id ', req.params.ride_id);
    const queryText = `
    DELETE FROM rides_users
    WHERE ride_id = $1
    AND user_id = $2`;
    pool.query(queryText, [req.params.ride_id, req.user.id])
        .then((result) => {
            console.log('delete rides_users ', result);
            res.sendStatus(201);
        })
        // error handling
        .catch((err) => {
            console.log('error making update completed query:', err);
            res.sendStatus(500);
        });
});

/* RideLeader Submit Ride for Approval */

router.post('/rideLeader/submitRide', isAuthenticated, (req, res) => {
    // console.log('user ', req.user);
    // console.log('req.body ', req.body);
    const query = `
    INSERT INTO rides (rides_name, ride_category, rides_date, description, ride_leader, url, ride_location) 
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id;`;
    pool.query(query, [req.body.rides_name, req.body.ride_category, req.body.rides_date, req.body.description, req.user.id, req.body.url, req.body.ride_location])
        .then((result) => {
            // console.log('resulting post id', result.rows);
            console.log('resulting post id', result.rows[0].id);
            let ride_id = result.rows[0].id;
            const newQuery = `
            INSERT INTO rides_distances (ride_id, distance) 
            VALUES ($1, $2)
            RETURNING id;`
            pool.query(newQuery, [ride_id, req.body.distances])
                .then((result) => {
                    // res.sendStatus(201);
                    console.log('resulting post id', result.rows[0].id);
                    let distance = result.rows[0].id;
                    const newerQuery = `
                    INSERT INTO rides_users (ride_id, user_id, selected_distance) 
                    VALUES ($1, $2, $3);`;
                    pool.query(newerQuery, [ride_id, req.user.id, distance])
                        .then((result) => {
                            res.sendStatus(201);
                        })
                        // error handling
                        .catch((err) => {
                            console.log('error making insert query:', err);
                            res.sendStatus(500);
                        });
                })
                .catch((err) => {
                    console.log('error making insert rides_distances query:', err);
                    res.sendStatus(500);
                });
        })
        // error handling
        .catch((err) => {
            console.log('error making insert rides query:', err);
            res.sendStatus(500);
        });

});



//Ride leader get info for check in view
router.get(`/rideLeader/currentRide/:rideId`, isAuthenticated, (req, res) => {
    const queryText = `
    SELECT * FROM rides
    WHERE id = $1`;
    pool.query(queryText, [req.params.rideId])
        .then((response) => {
            console.log('get current ride info ', response.rows);
            res.send(response.rows);
        })
        .catch((err) => {
            console.log('get current ride err ', err);
        });
    // res.send(list);
});

// Ride Leader Mark Ride as cancelled
router.put('/rideLeader/cancelRide/:rideId', isAuthenticated, (req, res) => {
    console.log('ride id to cancel ', req.params.rideId);
    const queryText = `
    UPDATE rides
    SET cancelled = $1
    WHERE id = $2`;
    pool.query(queryText, [true, req.params.rideId])
        .then((result) => {
            console.log('result update cancel ride ', result);
            res.sendStatus(201);
        })
        // error handling
        .catch((err) => {
            console.log('error making update cancel query:', err);
            res.sendStatus(500);
        });
});


// Ride Leader Mark Ride as cancelled
router.put('/rideLeader/toggleCheckIn', isAuthenticated, (req, res) => {
    console.log('ride id to cancel ', req.params.rideId);
    console.log('req.body ', req.body);
    const queryText = `
    UPDATE rides_users
    SET checked_in = $1
    WHERE user_id = $2
    AND ride_id = $3;`;
    pool.query(queryText, [req.body.checked_in, req.body.user_id, req.body.ride_id])
        .then((result) => {
            console.log('result update check in user ', result);
            res.sendStatus(201);
        })
        // error handling
        .catch((err) => {
            console.log('error making update check in user:', err);
            res.sendStatus(500);
        });
});

// Ride Leader Mark Ride as Complete
router.put('/rideLeader/complete/:rideId', isAuthenticated, (req, res) => {
    console.log('ride id to mark complete ', req.params.rideId);
    const queryText = `
    UPDATE rides
    SET completed = $1
    WHERE id = $2`;
    pool.query(queryText, [true, req.params.rideId])
        .then((result) => {
            console.log('result update comeplete ride ', result);
            res.sendStatus(201);
        })
        // error handling
        .catch((err) => {
            console.log('error making update completed query:', err);
            res.sendStatus(500);
        });
});
//Add Guest rider to db
router.post(`/rideLeader/addGuest`, isAuthenticated, (req, res) => {
    console.log('req.body ', req.body);
    const query = `
    INSERT INTO users (first_name, last_name, phone_1, email, role) 
    VALUES ($1, $2, $3, $4, $5)`;
    pool.query(query, [req.body.first_name, req.body.last_name, req.body.phone_1, req.body.email, 4])
        .then((result) => {
            res.sendStatus(201);
        })
        // error handling
        .catch((err) => {
            console.log('error making insert query:', err);
            res.sendStatus(500);
        });

});



module.exports = router;