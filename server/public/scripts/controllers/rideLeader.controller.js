myApp.controller('RideLeaderController', ['RideDetailService', 'UserService', '$mdDialog', function (RideDetailService, UserService, $mdDialog) {
    console.log('RideLeaderController created');
    let self = this;

    // self.distances = {
    //     selected,
    //     actual,
    // }
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

    }
    self.rides = RideDetailService.rides;

}]);