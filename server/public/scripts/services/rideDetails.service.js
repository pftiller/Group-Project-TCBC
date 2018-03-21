myApp.service('RideDetailService', ['$http', '$location', '$mdDialog', 'AdminService', function ($http, $location, $mdDialog, AdminService) {
    let self = this;
    self.allRides = {
        list: []
    }
    self.categories = {
        list: []
    }

    self.myRides = {
        list: []
    }

    self.myPastRides = {
        list: []
    }

    self.myLeadRides = {
        list: []
    }

    self.myMileage = {
        total: {}
    }

    let timeStamp = Date.now();

    self.todaysDate = {
        date: null
    }

    self.todaysDate.getDate = function () {
        this.date = moment(timeStamp).format('MM/DD/YYYY');

    }



    self.getMileageForMember = function () {
        return $http.get('/rides/member/mileage')
            .then((response) => {
                self.myMileage.total = response.data;
                return response.data;
            })
            .catch((err) => {
                swal('Error getting mileage for member', '', 'error');
            })
    }

    self.cancelThisRide = function (ride) {
        swal({
                title: `Do you want to cancel ${ride.rides_name}?`,
                text: `If you cancel ${ride.rides_name}, you cannot undo this action.`,
                icon: "warning",
                buttons: ["Nevermind", "Yes, cancel ride"],
                dangerMode: true,
            })
            .then((willDelete) => {
                if (willDelete) {
                    return $http.put(`/rides/rideLeader/cancelRide/${ride.ride_id}`)
                        .then((response) => {
                            self.getMyRideDetails()
                            self.getMyLeadRideDetails();
                            swal(`${ride.rides_name} was cancelled! You must submit a new ride for approval to create this ride again.`, {
                                icon: "success",
                            });
                        })
                        .catch((err) => {
                            swal('Error cancelling ride, please try again later.', '', 'error');
                        });
                } else {
                    swal(`${ride.rides_name} was not cancelled!`);
                }
            });

    }
    self.getMyLeadRideDetails = function () {
        return $http.get('/rides/rideLeader/leadRideDetails')
            .then((response) => {
                self.myLeadRides.list = [];
                response.data.forEach(ride => {
                    ride.leadingRide = true;
                    let momentDate = moment(ride.rides_date);
                    ride.date = momentDate.format('MM/DD/YYYY');
                    ride.time = momentDate.format('hh:mm A');
                    self.myLeadRides.list.push(ride);
                })
                return response.data;
            })
            .catch((err) => {
                swal('Error getting member leading ride details, please try again later.', '', 'error');
            })
    }

    self.getMyPastRideDetails = function () {
        return $http.get('/rides/member/pastRideDetails')
            .then((response) => {
                self.myPastRides.list = [];
                response.data.forEach(ride => {
                    let momentDate = moment(ride.rides_date);
                    ride.date = momentDate.format('MM/DD/YYYY');
                    ride.time = momentDate.format('hh:mm A');
                    self.myPastRides.list.push(ride);
                })
                return response.data;
            })
            .catch((err) => {
                swal('Error getting member past ride details, please try again later.', '', 'error');
            })
    }
    self.getMyRideDetails = function () {
        return $http.get('/rides/member/rideDetails')
            .then((response) => {
                self.myRides.list = [];
                response.data.forEach(ride => {
                    let momentDate = moment(ride.rides_date);
                    ride.date = momentDate.format('MM/DD/YYYY');
                    ride.time = momentDate.format('hh:mm A');
                    self.myRides.list.push(ride)
                })
                return response.data;
            })
            .catch((err) => {
                swal('Error getting member upcoming ride details, please try again later.', '', 'error');
            })
    }

    self.getAllRideDetails = function () {
        return $http.get('/rides/public/details')
            .then((response) => {
                for (let i = 0; i < response.data.length; i++) {
                    let dateOfRide = new Date(response.data[i].rides_date)
                    if (dateOfRide > timeStamp) {
                        let momentDate = moment(response.data[i].rides_date);
                        response.data[i].date = momentDate.format('MM/DD/YYYY');
                        response.data[i].time = momentDate.format('hh:mm A');
                    } else {
                        response.data[i].date = 'Past Ride';
                    }
                }
                self.allRides.list = response.data;
                return response;
            })
            .catch((err) => {
                swal('Error getting all ride details, please try again later.', '', 'error');
            })
    }

    self.getRideCategories = function () {
        return $http.get('/rides/public/categories')
            .then((response) => {
                for (let i = 0; i < response.data.length; i++) {
                    response.data[i].selected = true;
                }
                self.categories.list = response.data;
                return response.data;
            })
            .catch((err) => {
                swal('Error getting ride categories, please try again later.', '', 'error');
            })
    }

    self.rideDetailModal = function (ride, ev) {
        $mdDialog.show({
            controller: RideDetailController,
            controllerAs: 'vm',
            templateUrl: '../views/shared/ride-detail-modal.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            resolve: {
                item: function () {
                    return ride;
                }
            }
        })
    }

    function RideDetailController($mdDialog, item, RideDetailService, UserService) {
        const self = this;
        self.allRides = RideDetailService.allRides;
        self.ride = item;
        self.user = UserService.userObject;


        self.closeModal = function () {
            self.hide();
        }
        //if not signed in alert to sign in or register, else sign up for ride
        self.rideSignUp = function (ride) {
            if (self.user.member_id) {
                if (self.selectedDistance) {
                    self.selectedDistance;
                    ride.selected_distance = self.selectedDistance;
                    RideDetailService.signUpPost(ride)
                        .then(() => {
                            self.hide();
                            swal(`You signed up for ${ride.rides_name}`, '', 'success');
                        })
                        .catch((err) => {
                            swal(`Error signing you up for ${ride.rides_name}. Please try again later.`, '', 'error');
                        });
                } else {
                    swal('Please select a mileage for this ride before signing up.', '', 'warning');
                }
            } else {
                swal('Please log in or become a member to sign up for this ride.', '', 'warning');
            }
        }

        self.hide = function () {
            $mdDialog.hide();
        };

        self.cancel = function () {
            $mdDialog.cancel();
        };
    }

    self.signUpPost = function (ride) {
        return $http.post('/rides/signUp', ride)
            .then((response) => {
                if (response.data == "Must be logged in to add items!") {
                    swal('Please log in to sign up for rides.', '', 'warning');
                } else {
                    return response;
                }
            })
            .catch((err) => {
                swal('You have already signed up for this ride. Please check your rides page', '', 'error');
            })
    }

    self.initMyRideDetailModal = function (ride) {
        if (ride.past_ride) {
            return $http.get(`/rides/member/rideDetails/complete/${ride.ride_id}`)
                .then((response) => {
                    let newRide = response.data[0];
                    newRide.past_ride = true;
                    self.myRideDetailModal(newRide)
                    return response.data;
                })
                .catch((err) => {
                    swal('Error loading ride details, please try again later.', '', 'error');
                })
        } else if (ride.leadingRide) {
            return $http.get(`/rides/member/rideDetails/complete/${ride.ride_id}`)
                .then((response) => {
                    let newRide = response.data[0];
                    newRide.leadingRide = true;
                    self.myRideDetailModal(newRide)
                    return response.data;
                })
                .catch((err) => {
                    swal('Error loading ride details, please try again later.', '', 'error');
                })
        } else {
            return $http.get(`/rides/member/rideDetails/complete/${ride.ride_id}`)
                .then((response) => {
                    let newRide = response.data[0];
                    self.myRideDetailModal(newRide)
                    return response.data;
                })
                .catch((err) => {
                    swal('Error loading ride details, please try again later.', '', 'error');
                })
        }
    }

    self.myRideDetailModal = function (ride, ev) {
        $mdDialog.show({
            controller: MyRideDetailsController,
            controllerAs: 'vm',
            templateUrl: '../views/shared/ride-detail-modal-signed-up.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            resolve: {
                item: function () {
                    return ride;
                }
            }
        })
    }


    self.adminEditRideDetailModal = function (ride, ev) {
        $mdDialog.show({
            controller: EditRideDetailsController,
            controllerAs: 'vm',
            templateUrl: '../views/admin/templates/editRide-modal.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: false,
            resolve: {
                item: function () {
                    return ride;
                }
            }
        })
    }

    function MyRideDetailsController($mdDialog, item, RideDetailService) {
        const self = this;
        self.ride = item;
        self.user = {
            loggedIn: true
        };

        self.closeModal = function () {
            self.hide();
        }

        self.rideUnregister = function (item) {
            RideDetailService.rideUnregister(item)
                .then(() => {
                    self.hide();
                });
        };

        self.hide = function () {
            $mdDialog.hide();
        };

        self.cancel = function () {
            $mdDialog.cancel();
        };
    }
    self.rideUnregister = function (ride) {
        return $http.delete(`/rides/unregister/${ride.ride_id}`)
            .then((response) => {
                self.getMyRideDetails();
                swal(`You were removed from the ride: ${ride.rides_name}`, '', 'success');
            })
            .catch((err) => {
                swal('Error removing member from ride sign up, please try again later.', '', 'error');
            });
    }

    self.createNewRide = function (ev) {
        $mdDialog.show({
            controller: CreateNewRideController,
            controllerAs: 'vm',
            templateUrl: '../views/ride-leader/partials/create-ride-modal.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
        })
    }

    function CreateNewRideController($mdDialog, RideDetailService) {
        const self = this;
        self.categories = RideDetailService.categories;
        self.newRide = {};
        self.newRide.distances = [];

        self.closeModal = function () {
            self.hide();
        }

        self.myRides = RideDetailService.myRides;
        self.submitRide = function (ride) {
            if (!ride.rides_name || !ride.distances || !ride.description || !ride.ride_location || !ride.rides_category || !ride.rides_date) {
                swal("All fields, except GPS Link, are required.", '', "warning");
            } else {
                self.hide();

                $http.post('/rides/rideLeader/submitRide', ride)
                    .then((response) => {
                        swal("Ride has been Submitted for Approval", '', "success");
                        RideDetailService.getMyRideDetails();
                        RideDetailService.getMyLeadRideDetails();
                    })
                    .catch((err) => {
                        swal('Error submitting new ride, please try again later.', '', 'error');
                    });
            }
        }

        self.hide = function () {
            $mdDialog.hide();
        };

        self.cancel = function () {
            $mdDialog.cancel();
        };
    }

    /**  Admin Edit Ride and Approval Modal Controller*/


    function EditRideDetailsController($mdDialog, item, RideDetailService, AdminService) {
        const self = this;
        self.categories = RideDetailService.categories;
        self.rideToEdit = item;
        self.rideToEdit.rides_date = new Date(item.rides_date);

        self.approveAndSave = function (ride) {
            self.hide();

            $http.put('/rides/admin/approveAndSave', ride)
                .then((response) => {
                    swal('Successfully Approved', '', 'success');
                    AdminService.getPendingApprovedRides();
                })
                .catch((err) => {
                    swal('Error approving ride, please try again later.', '', 'error');
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