const express = require('express');
const router = express.Router();

list = {
    details: [
        ride1 = {
            name: 'Ride Name',
            date: 'Ride Date/Time',
            category: 'Ride Category',
            description: 'Description poijoisgoisgoisgoisjdgjojg',
            leader: 'Ride Leader',
            distancesAvailable: ['40', '30', '20'],
            actualDistance: '40',
            gps: 'Gps Link'
        },
        ride2 = {
            name: 'Ride2 Name',
            date: 'Ride2 Date/Time',
            category: 'Ride2 Category',
            description: 'Description2 poijoisgoisgoisgoisjdgjojg',
            leader: 'Ride2 Leader',
            distancesAvailable: ['20', '50', '100'],
            actualDistance: '50',
            gps: 'Gps Link2'
        }
    ]
};

router.get('/', (req, res) => {
    
    res.send(list);
});

module.exports = router;