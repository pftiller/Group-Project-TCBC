const express = require('express');
const router = express.Router();
const isAuthenticated = require('../modules/isAuthenticated');

list = {
    details: [
        ride1 = {
            rides_name: 'Ride Name',
            rides_date: '2018-04-12',
            rides_category: 'A/B – Strenuous',
            description: 'Description poijoisgoisgoisgoisjdgjojg',
            ride_leader: 'Ride Leader',
            distances: ['40', '30', '20'],
            url: 'Gps Link',
            completed: false
        },
        ride2 = {
            rides_name: 'Ride2 Name',
            rides_date: '2018-03-09',
            rides_category: 'C – Relaxed',
            description: 'Description2 poijoisgoisgoisgoisjdgjojg',
            ride_leader: 'Ride2 Leader',
            distances: ['20', '50', '100'],
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

router.get('/details', isAuthenticated, (req, res) => {

    res.send(list);
});

router.get('/categories', (req, res) => {
    res.send(categories);
});


router.post('/', isAuthenticated, (req, res)=>{
console.log('user ', req.user.member_id);
console.log('req.body ', req.body);
});



module.exports = router;