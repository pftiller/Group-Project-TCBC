myApp.service('RideDetailService', ['$http', '$location', '$mdDialog', function ($http, $location, $mdDialog) {
    console.log('RideDetailService Loaded');
    let self = this;
    self.rides = {
        list: []
    }

    self.getRideDetails = function () {
        return $http.get('/rides/details')
            .then((response) => {
                console.log(response.data);
                self.rides.list = response.data.details;
            })
            .catch((err) => {
                console.log(err);
            })
    }
    self.getRideDetails();

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
}]);