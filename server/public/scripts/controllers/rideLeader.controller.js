myApp.controller('RideLeaderController', ['RideDetailService', 'UserService', '$mdDialog', function (RideDetailService, UserService, $mdDialog) {
    console.log('RideLeaderController created');
    let self = this;


    self.rideDetailReveal = function (ride) {
        RideDetailService.loadWelcomeModal(ride);
    }

    self.cancelRide = function () {
        alert('CANCELED')
    }

    self.checkRidersIn = function () {
        
    }
    self.rides = RideDetailService.rides;

}]);