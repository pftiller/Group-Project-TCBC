const express = require('express');
const router = express.Router();
const isAuthenticated = require('../modules/isAuthenticated');

list = {
    details: [
        ride1 = {
            rides_name: 'Ride Name',
            rides_date: 'Ride Date/Time',
            rides_category: 'Ride Category',
            description: 'Description poijoisgoisgoisgoisjdgjojg',
            ride_leader: 'Ride Leader',
            distances: ['40', '30', '20'],
            url: 'Gps Link',
            completed: false
        },
        ride2 = {
            rides_name: 'Ride2 Name',
            rides_date: 'Ride2 Date/Time',
            rides_category: 'Ride2 Category',
            description: 'Description2 poijoisgoisgoisgoisjdgjojg',
            ride_leader: 'Ride2 Leader',
            distances: ['20', '50', '100'],
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