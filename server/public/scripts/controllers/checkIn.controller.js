myApp.controller('CheckInController', ['RideDetailService', 'UserService', 'CheckInService', '$mdDialog', '$location', '$routeParams', function (RideDetailService, UserService, CheckInService, $mdDialog, $location, $routeParams) {
    console.log('CheckInController created');
    let self = this;
    let rideId = $routeParams.rideId;
    
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

    self.markRideComplete = function(rideId){
        CheckInService.markRideComplete(rideId);
    }
    
}]);