myApp.service('CheckInService', ['$http', '$location', '$mdDialog', 'RideDetailService', function ($http, $location, $mdDialog, RideDetailService) {
    let self = this;
    self.ride = {
        current: {}
    };
    self.riders = {
        list: []
    }

    self.currentRide = function (rideId) {
        return $http.get(`/rides/rideLeader/currentRide/${rideId}`)
            .then((response) => {
                self.ride.current = response.data[0];
            })
            .catch((err) => {
                swal('Error getting getting current ride information, please try again later.', '', 'error');
            })
    }

    self.closeCheckIn = function () {
        $location.path('/ride-leader/my-rides');
    }


    self.getRidersForCurrentRide = function (rideId) {
        //Get all riders signed up for the ride at this ride ID
        return $http.get(`/rides/rideLeader/signedUpRiders/${rideId}`)
            .then((response) => {
                self.riders.list = response.data;
                return response.data;
            })
            .catch((err) => {
                swal('Error getting riders for this ride, please try again later.', '', 'error');
            })
    }

    self.markRideComplete = function (rideId) {
        return $http.put(`/rides/rideLeader/complete/${rideId}`)
            .then((response) => {
                return response.data;
            })
            .catch((err) => {
                swal('Error marking ride as complete, please try again later.', '', 'error');
            })
    }

    self.toggleCheckedIn = function (rider) {
        rider.checked_in = !rider.checked_in;
        return $http.put(`/rides/rideLeader/toggleCheckIn`, rider)
            .then((response) => {
                return response;
            })
            .catch((err) => {
                swal('Error toggling rider checked in, please try again later.', '', 'error');
            });
    }

    self.addMemberToRide = function () {
        self.memberRegisterModal();
    }
    self.addGuestToRide = function () {
        self.guestRegisterModal();
    }

    self.signUpPost = function (ride) {
        return $http.post('/rides/ride-leader/sign-up-member', ride)
            .then((response) => {
                self.getRidersForCurrentRide(ride.current.ride_id);
                return response;
            })
            .catch((err) => {
                swal('Error signing up for ride, please try again later.', '', 'error');
            })
    }

    self.memberRegisterModal = function (ride, ev) {
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
        self.searchMembers = {
            list: []
        }
        self.ride = CheckInService.ride;
        self.searchMemberParams = {
            first_name: '',
            last_name: '',
            member_id: ''
        }
        self.addMemberRider = function (member) {
            self.ride.member = member;
            CheckInService.signUpPost(self.ride)
                .then(() => {
                    $mdDialog.hide()
                });
        };

        self.searchForMember = function (member) {
            if (member.first_name == '') {
                member.first_name = 'BANANAJAMMA';
            }
            if (member.last_name == '') {
                member.last_name = 'FIDGETEEER';
            }
            if (member.member_id == '') {
                member.member_id = 0;
            }
            return $http.get(`/rides/ride-leader/searchMembers/${member.first_name}/${member.last_name}/${member.member_id}`)
                .then((response) => {
                    self.searchMembers.list = response.data;
                    self.searchMemberParams = {
                        first_name: '',
                        last_name: '',
                        member_id: ''
                    }
                })
                .catch((err) => {
                    swal('Error searching for member. Please try again later.', '', 'error');
                })
        }

        self.cancel = function () {
            $mdDialog.cancel();
        };
    }


    self.addGuestRider = function (rideId, guest) {
        return $http.post(`/rides/rideLeader/addGuest/${rideId}`, guest)
            .then((response) => {
                self.getRidersForCurrentRide(rideId);
            })
            .catch((err) => {
                swal('Error adding guest to ride, please try again later.', '', 'error');
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
        self.addGuestRider = function () {
            CheckInService.addGuestRider(rideId, self.newGuest)
                .then(() => {
                    self.hide();
                })
                .catch((err) => {
                    swal('Error adding guest to ride. Please try again later.', '', 'error');
                });
        }
        self.hide = function () {
            $mdDialog.hide();
        };

        self.cancel = function () {
            $mdDialog.cancel();
        };
    }
}]);