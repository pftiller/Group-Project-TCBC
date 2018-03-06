myApp.controller('RideLeaderController', ['RideDetailService', 'UserService', '$mdDialog', function (RideDetailService, UserService, $mdDialog) {
    console.log('RideLeaderController created');
    let self = this;

    self.rideDetailReveal = function (ride) {
        RideDetailService.myRideDetailModal(ride);
    }

    self.rideDetailRevealPast = function (ride) {
        RideDetailService.myRideDetailModal(ride);
    }

    self.cancelRide = function () {
        alert('CANCELED')
    }

    self.checkRidersIn = function () {
        alert('Check in riders')
    }

    self.createNewRide = function () {
        RideDetailService.createNewRide();
    }

    self.rides = RideDetailService.rides;
    self.myLeadRides = RideDetailService.myLeadRides;

}]);