myApp.service('RideDetailService', ['$http', '$location', '$mdDialog', function ($http, $location, $mdDialog) {
    console.log('RideDetailService Loaded');
    let self = this;
    self.rides = {
        list: []
    }
    self.categories = {
        list: []
    }

    self.myLeadRides = {
        list: []
    }


    // Let's run our comparison logic off of the User ID instead of a names string.  Two identical users could cause a bug with this.
        //for sure jsut used that for testing, thanks for making a note so we dont forget
    self.checkRidesForLeader = function (rides) {
        console.log('rides ', rides);
        rides.forEach((ride) => {
            if (ride.ride_leader == 'Lukas Nord') {
                self.myLeadRides.list.push(ride);
            }
        });
    }

    self.getRideDetails = function () {
        return $http.get('/rides/public/details')
                .then((response) => { 
                return response.data;
            })
            .catch((err) => {
                console.log(err);
            })
    }
    self.getRideDetails();
    
    self.getRideCategories = function () {
        return $http.get('/rides/public/categories')
            .then((response) => {
                return response.data;
            })
            .catch((err) => {
                console.log('error getting categories: ',err);
            })
    }

    self.getRideDetails().then((data) => {
        self.checkRidesForLeader(data)
    });

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

        self.rideSignUp = function (ride) {
            if (self.user.loggedIn === true) {
                console.log('SIGN ME UP FOR ', ride.name);
                RideDetailService.signUpPost(ride);
            } else {
                alert('Must log in to sign up for a ride!')
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
        return $http.post('/rides', ride)
            .then((response) => {
                console.log('post ride signup ', response);
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

    function MyRideDetailsController($mdDialog, item, RideDetailService) {
        const self = this;
        self.rides = RideDetailService.rides;
        self.ride = item;
        self.user = {
            loggedIn: true
        };

        self.rideSignUp = function (ride) {
            if (self.user.loggedIn === true) {
                console.log('SIGN ME UP FOR ', ride.name);
                RideDetailService.signUpPost(ride);
            } else {
                alert('Must log in to sign up for a ride!')
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
    self.rideUnregister = function (ride) {
        console.log('unregister for ride ', ride);
        // return $http.post('/rides', ride)
        //     .then((response) => {
        //         console.log('unregister ', response);
        //     })
        //     .catch((err) => {
        //         console.log('err on post ride sign up ', err);

        //     })
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
        self.submitRide = function (ride) {
            console.log('new ride', ride);
            self.hide();
            alert('Ride submitted for approval, check back later!');
            $http.post('/rides/rideLeader/submitRide', ride)
                .then((response) => {
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