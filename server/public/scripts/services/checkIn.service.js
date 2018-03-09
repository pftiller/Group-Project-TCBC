myApp.service('CheckInService', ['$http', '$location', '$mdDialog', 'RideDetailService', function ($http, $location, $mdDialog, RideDetailService) {
    console.log('CheckInService Loaded');
    let self = this;
    self.ride = {
        current: {}
    };
    self.riders = {
        list: []
    }

    self.currentRide = function (rideId) {
        //get ride information for current ride 
        return $http.get(`/rides/rideLeader/currentRide/${rideId}`)
            .then((response) => {
                console.log(response.data[0]);
                self.ride.current = response.data[0];
            })
            .catch((err) => {
                swal('Error getting getting current ride information, please try again later.', '', 'error');
                // console.log(err);
            })
    }

    self.closeCheckIn = function () {
        $location.path('/ride-leader/my-rides');
    }


    self.getRidersForCurrentRide = function (rideId) {
        console.log('Ride to get users for ', rideId);
        //Get all riders signed up for the ride at this ride ID
        //need some joins and such to find members tied to this ride
        return $http.get(`/rides/rideLeader/signedUpRiders/${rideId}`)
            .then((response) => {
                console.log('Riders for this ride found!', response.data);
                self.riders.list = response.data;
                return response.data;
            })
            .catch((err) => {
                swal('Error getting riders for this ride, please try again later.', '', 'error');
                // console.log('ERR getting riders on this ride ', err);
            })
    }

    //when Ride Complete button clicked runs this funciton on current ride
    self.markRideComplete = function (rideId) {
        console.log('mark ride complete ', rideId);
        //Put request on proper ride id, change completed to true and then after that give members their mileage
        return $http.put(`/rides/rideLeader/complete/${rideId}`)
            .then((response) => {
                console.log('Ride marked complete!', response);
                self.updateRiderMileage(rideId);
                return response.data;
            })
            .catch((err) => {
                swal('Error marking ride as complete, please try again later.', '', 'error');
                // console.log('ERR updating ride to complete ', err);
            })
    }

    self.updateRiderMileage = function (rideId) {
        return $http.put(`/rides/rideLeader/complete/updateMiles/${rideId}`)
            .then((response) => {
                console.log('Ride marked complete!', response);
                return response.data;
            })
            .catch((err) => {
                swal('Error updating member mileage, please try again later.', '', 'error');
                // console.log('ERR updating ride to complete ', err);
            })
    }

    self.toggleCheckedIn = function (rider) {
        rider.checked_in = !rider.checked_in;
        console.log('rider check ', rider.checked_in);
        return $http.put(`/rides/rideLeader/toggleCheckIn`, rider)
            .then((response) => {
                console.log('toggle user check in ', response);
            })
            .catch((err) => {
                swal('Error toggling rider checked in, please try again later.', '', 'error');
                // console.log('err from toggle check in put ', err);
            });
    }

    //Add rider 
    self.addMemberToRide = function () {
        // console.log('ADD RIDER ');
        self.memberRegisterModal();
    }
    self.addGuestToRide = function () {
        // console.log('ADD GUEST');
        self.guestRegisterModal();
    }

    self.addGuestRider = function (guest) {
        console.log('ADD GUEST TO THIS RIDE ');
        return $http.post(`/rides/rideLeader/addGuest`, guest)
            .then((response) => {
                console.log('add guest to ride response ', response);
            })
            .catch((err) => {
                swal('Error adding guest to ride, please try again later.', '', 'error');
                // console.log('err adding guest to ride', err);
            })
    }

    self.memberRegisterModal = function(ride, ev) {
        $mdDialog.show({
            controller: MemberRegisterController,
            controllerAs: 'vm',
            templateUrl: '../views/ride-leader/partials/member-register-modal.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
        })
    }

    function MemberRegisterController($mdDialog, CheckInService, $routeParams) {
        const self = this;
        let rideId = $routeParams.rideId
        
        self.addMemberRider = function (member) {
            
        };
        self.searchForMember = function (member) {
            console.log('member search for ', member);
        }

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
        self.addGuestRider = function () {
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