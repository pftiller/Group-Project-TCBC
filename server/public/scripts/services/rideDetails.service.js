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
    // timeStamp = timeStamp.toUTCString();
    
    self.todaysDate = {
        date: null
    }

   self.todaysDate.getDate = function() {
        this.date = moment(timeStamp).format('MM/DD/YYYY');

   }
    console.log('Date.now()', timeStamp)


    self.getMileageForMember = function () {
        return $http.get('/rides/member/mileage')
            .then((response) => {
                console.log('get mileage response ', response.data);
                self.myMileage.total = response.data;
            })
            .catch((err) => {
                // console.log('get mileage err ', err);
                swal('Error getting mileage for member', '', 'error');
            })
    }


    // Let's run our comparison logic off of the User ID instead of a names string.  Two identical users could cause a bug with this.
    //for sure jsut used that for testing, thanks for making a note so we dont forget
    self.checkRidesForLeader = function (rides) {
        console.log('lead rides check ', rides);
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
        })
        console.log('lead rides ', self.myLeadRides);
        
    }

    self.cancelThisRide = function (ride) {
        console.log('ride to cancel ', ride);
        return $http.put(`/rides/rideLeader/cancelRide/${ride.ride_id}`)
            .then((response) => {
                self.getMyRideDetails()
                    .then((data) => {
                        self.checkRidesForLeader(self.myRides.list)
                    });
                console.log('cancel ride put response ', response);
            })
            .catch((err) => {
                swal('Error cancelling ride, please try again later.', '', 'error');
                // console.log('cancel ride put err ', err);
            });
    }
   
   

    // date.toUTCString();
    function checkRideDate(rideDate, ride) {
        if (rideDate > timeStamp) {
            console.log('date new');
            //will check against todays date with real data
            self.myRides.list.push(ride)
            // self.ride.past_ride = false;
        } else {
            console.log('date old');
            // self.ride.past_ride = true;
            self.myPastRides.list.push(ride);
        }
    }

    self.getMyRideDetails = function () {
        return $http.get('/rides/member/rideDetails')
            .then((response) => {
                self.myRides.list = [];
                self.myPastRides.list = [];
                console.log('my ride results ', response.data);
                response.data.forEach(ride => {
                    if (!ride.cancelled) {
                        // let date = new Date(ride.rides_date)
                        // console.log('date ', date.toUTCString());
                        // if (date.toUTCString() >  timeStamp) {
                        //     //will check against todays date with real data
                        //     ride.past_ride = false;
                        // } else {
                        //     ride.past_ride = true;
                        // }
                        let date = new Date(ride.rides_date)
                        // console.log('date ', date);
                        checkRideDate(date, ride);
                        // console.log('old rides ', self.myPastRides);
                    } else {
                        // console.log('this ride is cancelled', ride);
                    }
                })
                return response.data;
            })
            .catch((err) => {
                swal('Error getting member ride details, please try again later.', '', 'error');
                // console.log(err);
            })
    }

    self.getAllRideDetails = function () {
        return $http.get('/rides/public/details')
            .then((response) => {
                console.log('all rides ', response.data);
                for(let i = 0; i < response.data.length; i ++) {
                    let dateOfRide = new Date(response.data[i].rides_date)
                    if (dateOfRide > timeStamp) {
                        let momentDate = moment(response.data[i].rides_date);
                        response.data[i].date = momentDate.format('MM/DD/YYYY');
                        response.data[i].time = momentDate.format('hh:mm A');
                       
                    } 
                }            
               self.rides.list = response.data;
                return response;
            })
            .catch((err) => {
                swal('Error getting all ride details, please try again later.', '', 'error');
            })
    }

    self.getRideCategories = function () {
        return $http.get('/rides/public/categories')
            .then((response) => {
                self.categories.list = response.data;
                return response.data;
            })
            .catch((err) => {
                swal('Error getting ride categories, please try again later.', '', 'error');
                // console.log('error getting categories: ', err);
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
        self.rides = RideDetailService.rides;
        self.ride = item;
        self.user = UserService.userObject;

        //if not signed in alert to sign in or register, else sign up for ride
        self.rideSignUp = function (ride) {
            if (self.user.member_id) {
                console.log('SIGN ME UP FOR ', ride.rides_name);
                self.selectedDistance;
                console.log('distance ', self.selectedDistance);
                ride.selected_distance = self.selectedDistance;
                RideDetailService.signUpPost(ride)
                    .then(() => {
                        self.hide();
                    });;
                } else {
                    swal('Please log in or become a member to sign up for this ride.', '', 'error');
                    // alert('Please log in or become a member to sign up for this ride.')
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
                    swal('Must log in to sign up for rides!', '', 'error');
                } else {
                    console.log('post ride signup ', response);
                    return response;
                }
            })
            .catch((err) => {
                swal('Error signing up for ride, please try again later.', '', 'error');
                // console.log('err on post ride sign up ', err);
            })
    }


    self.currentRide = function (rides) {
        rides.forEach(ride => {
            if (ride.rides_date > '2018-03-03T06:00:00.000Z') {
                //will check against todays date with real data
                // ride.past_ride = false;
            } else {
                self.myPastRides.list.push(ride);
                // ride.past_ride = true;
            }
        })
    }

    self.initMyRideDetailModal = function (ride) {
        console.log('ride ', ride);
        return $http.get(`/rides/member/rideDetails/complete/${ride.ride_id}`)
            .then((response) => {
                console.log('response modal', response.data[0]);
                self.myRideDetailModal(response.data[0])
                return response.data;
            })
            .catch((err) => {
                swal('Error loading ride details, please try again later.', '', 'error');
                // console.log(err);
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
        // console.log('unregister for ride ', ride);
        return $http.delete(`/rides/unregister/${ride.ride_id}`)
            .then((response) => {
                self.getMyRideDetails()
                    .then((data) => {
                        self.checkRidesForLeader(self.myRides.list)
                    });
                console.log('unregister ', response);
            })
            .catch((err) => {
                swal('Error removing member from ride sign up, please try again later.', '', 'error');
                // console.log('err on post ride sign up ', err);

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
        self.newRide = {};
        self.newRide.distances = [];

        self.submitRide = function (ride) {
            if(!ride.rides_name || !ride.distances || !ride.description || !ride.ride_location || !ride.rides_category || !ride.rides_date){
                console.log('ride failed to submit: ', ride);
                
                swal("All fields, except GPS Link, are required.", '', "warning");
            }else{
            console.log('new ride', ride);
            self.hide();

            $http.post('/rides/rideLeader/submitRide', ride)
                .then((response) => {
                    swal("Ride has been Submitted for Approval",'', "success");
                    RideDetailService.getMyRideDetails()
                        .then((data) => {
                            RideDetailService.checkRidesForLeader(self.myRides.list);
                        });
                    console.log('response post ride ', response);
                })
                .catch((err) => {
                    swal('Error submitting new ride, please try again later.', '', 'error');
                    // console.log('err post ride ', err);
                });
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
    self.getRideCategories();
    self.getAllRideDetails();
    // self.getMyRideDetails()
    //     .then((data) => {            
    //         self.checkRidesForLeader(self.myRides.list);
    //     });







    function EditRideDetailsController($mdDialog,item, RideDetailService) {
        const self = this;
        self.categories = RideDetailService.categories;
        self.rideToEdit = item;
        self.rideToEdit.rides_date = new Date(item.rides_date);
        self.submitRide = function (ride) {
            // console.log('new ride', ride);
            self.hide();
            alert('Ride submitted for approval, check back later!');

            $http.post('/rides/rideLeader/submitRide', ride)
                .then((response) => {
                    RideDetailService.getMyRideDetails()
                        .then((data) => {
                            RideDetailService.checkRidesForLeader(self.myRides.list);
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