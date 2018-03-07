myApp.controller('RideLeaderController', ['RideDetailService', 'UserService', 'CheckInService', '$mdDialog', '$location', function (RideDetailService, UserService, CheckInService, $mdDialog, $location) {
    console.log('RideLeaderController created');
    let self = this;

    self.userObject = UserService.userObject;
    self.user_id = self.userObject.user_id;

    self.rideDetailReveal = function (ride) {
        RideDetailService.myRideDetailModal(ride);
    }

    self.rideDetailRevealPast = function (ride) {
        RideDetailService.myRideDetailModal(ride);
    }

    self.cancelRide = function (ride) {
        RideDetailService.cancelThisRide(ride);
        alert('CANCELED')
    }

    self.createNewRide = function () {
        RideDetailService.createNewRide();
    }

    self.rides = RideDetailService.rides;
    self.myRides = RideDetailService.myRides;
    self.myLeadRides = RideDetailService.myLeadRides;

    self.checkRidersIn = function (ride) {
        $location.path(`/check-in/${ride.ride_id}`)
    }

    RideDetailService.getRideCategories();

}]);