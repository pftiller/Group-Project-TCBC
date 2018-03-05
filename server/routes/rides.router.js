const express = require('express');
const router = express.Router();
const isAuthenticated = require('../modules/isAuthenticated');

list = {
    details: [
        ride1 = {
            rides_name: 'Cycle through the lakes',
            rides_date: '02-02-2018',
            rides_category: 'A',
            description: 'Description poijoisgoisgoisgoisjdgjojg',
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
            actualDistance: '40',
            url: 'Gps Link',
            completed: false
        },
        ride2 = {
            rides_name: 'Ride2 Name',
            rides_date: '03-03-2018',
            rides_category: 'Ride2 Category',
            description: 'Description2 poijoisgoisgoisgoisjdgjojg',
            ride_leader: 'Lukas Nord',
            distances: ['20', '50', '100'],
            selected_distance: '20',
            actualDistance: '50',
            url: 'Gps Link2',
            completed: true
        }
    ]
};

router.get('/details', isAuthenticated, (req, res) => {

    res.send(list);
});

router.post('/', isAuthenticated, (req, res)=>{
console.log('user ', req.user.member_id);
console.log('req.body ', req.body);
});

module.exports = router;