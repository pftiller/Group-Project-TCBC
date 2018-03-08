
myApp.service('RideDetailService', ['$http', '$location', '$mdDialog', function ($http, $location, $mdDialog) {
    console.log('RideDetailService Loaded');
    let self = this;
    self.rides = {
        list: []
    }
    self.categories = {
        list: []
    }

    self.myRides = {
        list: []
    }

    self.myLeadRides = {
        list: []
    }

    self.myMileage = {
        total: {}
    }

    self.getMileageForMember = function(){
        return $http.get('/rides/member/mileage')
            .then((response)=>{
                console.log('get mileage response ', response.data);
                self.myMileage.total = response.data;
            })
            .catch((err)=>{
                console.log('get mileage err ', err);
            })
    }
    self.getMileageForMember();


    // Let's run our comparison logic off of the User ID instead of a names string.  Two identical users could cause a bug with this.
    //for sure jsut used that for testing, thanks for making a note so we dont forget
    self.checkRidesForLeader = function (rides) {
        // console.log('rides ', rides);
        // console.log('lead user', user);
        self.myLeadRides.list = [];
        rides.forEach((ride) => {
            if (ride.ride_leader == ride.user_id) {
                // console.log('ride', ride);
                if (!ride.cancelled) {
                    self.myLeadRides.list.push(ride);
                } else {
                    // console.log('this ride is cancelled', ride);
                }
            }
        });
    }

    self.cancelThisRide = function (ride) {
        console.log('ride to cancel ', ride);
        return $http.put(`/rides/rideLeader/cancelRide/${ride.ride_id}`)
            .then((response) => {
                self.getMyRideDetails()
                    .then((data) => {
                        self.checkRidesForLeader(data)
                    });
                console.log('cancel ride put response ', response);
            })
            .catch((err) => {
                console.log('cancel ride put err ', err);
            });
    }


    self.getMyRideDetails = function () {
        return $http.get('/rides/member/rideDetails')
            .then((response) => {
                self.myRides.list = [];  
                console.log('my ride results ', response.data);
                response.data.forEach(ride => {
                    if (!ride.cancelled) {
                        self.myRides.list.push(ride)
                    } else {
                        // console.log('this ride is cancelled', ride);
                    }
                })
                return response.data;
            })
            .catch((err) => {
                console.log(err);
            })
    }

    self.getAllRideDetails = function () {
        return $http.get('/rides/public/details')
            .then((response) => {
                // console.log('all rides ', response.data);
                self.rides.list = response.data;
                return response.data;
            })
            .catch((err) => {
                console.log(err);
            })
    }

    self.getRideCategories = function () {
        return $http.get('/rides/public/categories')
            .then((response) => {
                self.categories.list = response.data;
                return response.data;
            })
            .catch((err) => {
                console.log('error getting categories: ', err);
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

    function RideDetailController($mdDialog, item, RideDetailService) {
        const self = this;
        self.rides = RideDetailService.rides;
        self.ride = item;
        self.user = {
            loggedIn: true
        };
        self.selectedDistance;

        //if not signed in alert to sign in or register, else sign up for ride
        self.rideSignUp = function (ride) {
            if (self.user.loggedIn === true) {
                console.log('SIGN ME UP FOR ', ride.rides_name);
                // let thenum = self.selectedDistance.match(/\d+/)[0];
                console.log('distance ', self.selectedDistance);
                ride.selected_distance = self.selectedDistance;
                RideDetailService.signUpPost(ride)
                    .then(() => {
                        self.hide();
                    });;
            }
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

    self.signUpPost = function (ride) {
        console.log('Signing up for ride ', ride);
        return $http.post('/rides/signUp', ride)
            .then((response) => {
                if (response.data == "Must be logged in to add items!") {
                    console.log(response);
                    alert('Must log in to sign up for rides!')
                } else {
                    return response;
                    console.log('post ride signup ', response);
                }
            })
            .catch((err) => {
                console.log('err on post ride sign up ', err);

            })
    }


    self.currentRide = function (rides) {
        rides.forEach(ride => {
            if (ride.rides_date > '02-03-2018') {
                //will check against todays date with real data
                ride.past_ride = false;
            } else {
                ride.past_ride = true;
            }
        })
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
            clickOutsideToClose: true,
            resolve: {
                item: function () {
                    return ride;
                }
            }
        })
    }

    function MyRideDetailsController($mdDialog, item, RideDetailService) {
        const self = this;
        self.rides = RideDetailService.rides;
        self.ride = item;
        self.user = {
            loggedIn: true
        };

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
    self.rideUnregister = function (ride) {
        console.log('unregister for ride ', ride);
        return $http.delete(`/rides/unregister/${ride.ride_id}`)
            .then((response) => {
                self.getMyRideDetails()
                    .then((data) => {
                        self.checkRidesForLeader(data)
                    });
                console.log('unregister ', response);
            })
            .catch((err) => {
                console.log('err on post ride sign up ', err);

            })
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

        self.submitRide = function (ride) {
            console.log('new ride', ride);
            self.hide();
            alert('Ride submitted for approval, check back later!');

            $http.post('/rides/rideLeader/submitRide', ride)
                .then((response) => {
                    RideDetailService.getMyRideDetails()
                        .then((data) => {
                            RideDetailService.checkRidesForLeader(data);
                        });
                    console.log('response post ride ', response);
                })
                .catch((err) => {
                    console.log('err post ride ', err);
                });
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
    self.getRideCategories();
    self.getAllRideDetails();
    self.getMyRideDetails()
    .then((data) => {
        self.checkRidesForLeader(data);
    });







    function EditRideDetailsController($mdDialog,item, RideDetailService) {
        const self = this;
        self.categories = RideDetailService.categories;
        self.rideToEdit = item;
        self.rideToEdit.rides_date = new Date(item.rides_date);
        self.submitRide = function (ride) {
            console.log('new ride', ride);
            self.hide();
            alert('Ride submitted for approval, check back later!');

            $http.post('/rides/rideLeader/submitRide', ride)
                .then((response) => {
                    RideDetailService.getMyRideDetails()
                        .then((data) => {
                            RideDetailService.checkRidesForLeader(data);
                        });
                    console.log('response post ride ', response);
                })
                .catch((err) => {
                    console.log('err post ride ', err);
                });
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