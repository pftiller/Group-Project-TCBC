myApp.controller('RideLeaderController', ['RideDetailService', 'UserService', 'CheckInService', '$mdDialog', '$location', function (RideDetailService, UserService, CheckInService, $mdDialog, $location) {
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

    self.createNewRide = function () {
        RideDetailService.createNewRide();
    }

    self.rides = RideDetailService.rides;
    self.myLeadRides = RideDetailService.myLeadRides;

    self.checkRidersIn = function (ride) {  
        $location.path(`/check-in/${ride.id}`)
    }
    
    RideDetailService.getMyRideDetails();
    
    RideDetailService.getRideCategories();

}]);