myApp.controller('CheckInController', ['RideDetailService', 'UserService', 'CheckInService', '$mdDialog', '$location', function (RideDetailService, UserService, CheckInService, $mdDialog, $location) {
    console.log('CheckInController created');
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

    self.createNewRide = function () {
        RideDetailService.createNewRide();
    }

    self.rides = RideDetailService.rides;
    self.myLeadRides = RideDetailService.myLeadRides;

    self.checkRidersIn = function () {
        
        $location.path('/check-in')
    }

    self.riders = CheckInService.riders;
}]);