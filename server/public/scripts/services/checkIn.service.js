myApp.service('CheckInService', ['$http', '$location', '$mdDialog', function ($http, $location, $mdDialog) {
    console.log('CheckInService Loaded');
    let self = this;
    self.ride = {
        current: {}
    };
    self.riders = {
        list: [{
                member_id: 123,
                member_name: 'Patrick',
                checked_in: false
            },
            {
                member_id: 152,
                member_name: 'Darren',
                checked_in: true
            },
            {
                member_id: 124,
                member_name: 'Lukas',
                checked_in: false
            },
        ]
    }

    self.currentRide = function (rideId) {
        //get ride information for current ride 
        return $http.get(`/rides/rideLeader/currentRide/${rideId}`)
            .then((response) => {
                console.log(response.data[0]);
                self.ride.current = response.data[0];
            })
            .catch((err) => {
                console.log(err);
            })
    }

    self.getRidersForCurrentRide = function (rideId) {
        console.log('Ride to get users for ', rideId);

        //Get all riders signed up for the ride at this ride ID

        // return $http.get(`/rides/rideLeader/signedUpRiders/${rideId}`)
        //     .then((response) => {
        //         console.log('Riders for this ride found!', response);
        //     })
        //     .catch((err) => {
        //         console.log('ERR getting riders on this ride ', err);
        //     })
    }


    self.markRideComplete = function (rideId) {
        console.log('mark ride complete ', rideId);
        //Put request on proper ride id, change completed to true and then after that give members their mileage
        return $http.put(`/rides/rideLeader/complete/${rideId}`)
            .then((response) => {
                console.log('Ride marked complete!', response);
            })
            .catch((err) => {
                console.log('ERR updating ride to complete ', err);
            })
    }
}]);