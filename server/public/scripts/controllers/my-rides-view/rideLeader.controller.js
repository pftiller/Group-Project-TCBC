myApp.controller('RideLeaderController', ['RideDetailService', 'UserService', 'CheckInService', '$mdDialog', '$location', function (RideDetailService, UserService, CheckInService, $mdDialog, $location) {
    console.log('RideLeaderController created');
    let self = this;

    self.userObject = UserService.userObject;
    self.user_id = self.userObject.user_id;

    self.rideDetailReveal = function (ride) {
        RideDetailService.initMyRideDetailModal(ride);
    }

    self.rideDetailRevealPast = function (ride) {
        RideDetailService.initMyRideDetailModal(ride);
    }

    self.cancelRide = function (ride) {
        RideDetailService.cancelThisRide(ride);
        swal(`Cancelled ride ${ride.rides_name}`, '', 'warning');
    }

    self.createNewRide = function () {
        RideDetailService.createNewRide();
    }

    self.rides = RideDetailService.rides;
    self.myRides = RideDetailService.myRides;
    self.myLeadRides = RideDetailService.myLeadRides;
    self.myPastRides = RideDetailService.myPastRides;

    self.checkRidersIn = function (ride) {
        $location.path(`/check-in/${ride.ride_id}`)
    }

    // RideDetailService.getRideCategories();
    RideDetailService.getMyRideDetails()
        .then((data) => {            
            RideDetailService.checkRidesForLeader(self.myRides.list);
        });
}]);