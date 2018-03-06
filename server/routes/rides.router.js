const express = require('express');
const router = express.Router();
const isAuthenticated = require('../modules/isAuthenticated');
const pool = require('../modules/pool');
const ridePackager = require('../modules/ridePackager.module');
list = {
    details: [
        ride1 = {
            id: 1,
            rides_name: 'Cycle through the lakes',
            rides_date: '02-02-2018',
            rides_category: 'A',
            description: 'Description poijoisgoisgoisgoisjdgjojg',
            ride_location: '123 E Berry ST, St. Paul, MN',
            ride_leader: 'Paul Tiller',
            distances: ['40', '30', '20'],
            selected_distance: '30',
            actualDistance: '40',
            url: 'Gps Link',
            completed: false
        },
        ride3 = {
            id: 2,
            rides_name: 'Fun ride around',
            rides_date: '01-17-2018',
            rides_category: 'B',
            description: 'Description poijoisgoisgoisgoisjdgjojg',
            ride_leader: 'Lukas Nord',
            ride_location: '123 E North ST, Minneapolis, MN',
            distances: ['15', '25', '66'],
            selected_distance: '15',
            actualDistance: '66',
            url: 'Gps Link',
            completed: false
        },
        ride4 = {
            id: 3,
            rides_name: 'Hard cycle up mountain',
            rides_date: '04-11-2018',
            rides_category: 'C',
            description: 'Description poijoisgoisgoisgoisjdgjojg',
            ride_leader: 'Patrick Connelly',
            distances: ['40', '80', '120'],
            selected_distance: '120',
            ride_location: '123 W Chester ST, Duluth, MN',
            actualDistance: '40',
            url: 'Gps Link',
            completed: false
        },
        ride2 = {
            id: 4,
            rides_name: 'Ride2 Name',
            rides_date: '03-03-2018',
            rides_category: 'MB-A',
            description: 'Description2 poijoisgoisgoisgoisjdgjojg',
            ride_leader: 'Lukas Nord',
            distances: ['20', '50', '100'],
            selected_distance: '20',
            ride_location: '123 S Mouth ST, Rochester, MN',
            actualDistance: '50',
            url: 'Gps Link2',
            completed: true
        }
    ]
};


categories = {
    options: [
        'A – Very Strenuous',
        'A/B – Strenuous',
        'B – Brisk',
        'B/C – Moderate',
        'C – Relaxed',
        'MB-A – Members Only',
        'MB-AB – Member Only',
        'MB-B – Members Only',
        'MB-C – Members Only',
        'N-A – Night',
        'N-A/B – Night',
        'N-B – Night',
        'N-B/C – Night',
        'N-C – Night',
        'O – Outreach',
        'S – Special'
    ]
}


        /* GET all rides*/ 
        
router.get('/public/details',  (req, res) => {
    
    
    const allRidesQuery = `SELECT rides.id AS ride_id, array_agg(rides_distances.distance) AS ride_distance, array_agg(rides_distances.id) AS ride_distance_id, rides.rides_name,rides.rides_date,rides.description,rides.url,rides.ride_location, rides.ride_leader, users.first_name, users.last_name,users.phone_1,users.email
    FROM rides 
    JOIN rides_distances on rides.id = rides_distances.ride_id
    JOIN users on rides.ride_leader = users.id
    GROUP BY rides.id, users.first_name, users.last_name, users.phone_1,users.email;`

    pool.query(allRidesQuery)
        .then((result)=>{
          let formattedRides = ridePackager(result.rows);
          res.send(formattedRides);
        })
        .catch((err)=>{
            console.log('error getting all rides');
            
        })

});




<<<<<<< HEAD
            /* GET All Categories */

=======
            /* Fetch All Categories */
>>>>>>> 93026c107c33f89c319cf8ace7aaa3ad4e41060e
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


/* RideLeader Submit Ride for Approval */

router.post('/rideLeader/submitRide', isAuthenticated, (req, res) => {
    console.log('user ', req.user);
    console.log('req.body ', req.body);
    const query = 'INSERT INTO rides (rides_name, rides_category, rides_date, description, ride_leader, url, ride_location) VALUES ($1, $2, $3, $4, $5, $6, $7)';
    pool.query(query, [req.body.rides_name, req.body.rides_category, req.body.rides_date, req.body.description, req.user.id, req.body.url, req.body.ride_location])
        .then((result) => {
            res.sendStatus(201);
        })
        // error handling
        .catch((err) => {
            console.log('error making insert query:', err);
            res.sendStatus(500);
        });

});

router.get(`/rideLeader/currentRide/:rideId`, isAuthenticated, (req, res) => {
    const queryText = `
    SELECT * FROM rides
    WHERE id = $1`;
    pool.query(queryText, [req.params.rideId])
        .then((response)=>{
            console.log('get current ride info ', response.rows);
            res.send(response.rows);
        })
        .catch((err)=>{
            console.log('get current ride err ', err);
        });
    // res.send(list);
});



// Ride Leader Mark Ride as Complete
router.put('/rideLeader/complete/:rideId', isAuthenticated, (req, res) => {
    console.log('user ', req.params.rideId);
    console.log('req ', req.body);
    const queryText = `
    UPDATE rides
    SET completed = $1
    WHERE id = $2`;
    pool.query(queryText, [true, req.params.rideId])
        .then((result) => {
            console.log('result update ', result);
            res.sendStatus(201);
        })
        // error handling
        .catch((err) => {
            console.log('error making update completed query:', err);
            res.sendStatus(500);
        });

});




module.exports = router;