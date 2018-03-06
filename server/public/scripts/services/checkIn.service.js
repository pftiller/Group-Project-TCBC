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
            //need some joins and such to find members tied to this ride

        // return $http.get(`/rides/rideLeader/signedUpRiders/${rideId}`)
        //     .then((response) => {
        //         console.log('Riders for this ride found!', response);
        //     })
        //     .catch((err) => {
        //         console.log('ERR getting riders on this ride ', err);
        //     })
    }

    //when Ride Complete button clicked runs this funciton on current ride
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

    //Add rider 
    self.addMemberToRide = function(){
        console.log('ADD RIDER ');
        
    }
    self.addGuestToRide = function(){
        console.log('ADD GUEST');
        self.guestRegisterModal();
    }

    self.addGuestRider = function(guest){
        console.log('ADD GUEST TO THIS RIDE ');
        return $http.post(`/rides/rideLeader/addGuest`, guest)
            .then((response)=>{
                console.log('add guest to ride response ', response);
            })
            .catch((err)=>{
                console.log('err adding guest to ride', err);
            })
    }


    self.guestRegisterModal = function (ride, ev) {
        $mdDialog.show({
            controller: GuestRegisterController,
            controllerAs: 'vm',
            templateUrl: '../views/ride-leader/partials/guest-register-modal.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
        })
    }

    function GuestRegisterController($mdDialog, CheckInService, $routeParams) {
        const self = this;
        let rideId = $routeParams.rideId
        self.addGuestRider = function(){
            console.log('guest ', self.newGuest);
            CheckInService.addGuestRider(self.newGuest)
                // .then(()=>{
                //     self.hide();
                // })
        }
        self.hide = function () {
                $mdDialog.hide();
            };

            self.cancel = function () {
                $mdDialog.cancel();
            };

            self.success = function (answer) {
                // console.log('answer', answer);
                swal(answer, '', {
                    className: "success-alert",
                });
                // $mdDialog.hide(answer);
            };
            self.error = function (answer) {
                // console.log('answer', answer);
                swal(answer, '', 'error', {
                    className: "error-alert",
                });
                // $mdDialog.hide(answer);
            };
    }
}]);