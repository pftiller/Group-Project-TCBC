const express = require('express');
const router = express.Router();
const isAuthenticated = require('../modules/isAuthenticated');
const pool = require('../modules/pool');

list = {
    details: [
        ride1 = {
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

router.get('/public/details', isAuthenticated, (req, res) => {

    res.send(list);
});




            /* Fetch All Categories */

router.get('/public/categories', (req, res) => {
    //res.send(categories);
    const CategoryQuery = `SELECT * FROM categories`;
    pool.query(CategoryQuery)
        .then((result)=>{
            res.send(result.rows);
        })
        .catch((err)=>{
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



module.exports = router;