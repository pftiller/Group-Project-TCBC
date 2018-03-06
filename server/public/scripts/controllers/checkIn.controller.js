myApp.controller('CheckInController', ['RideDetailService', 'UserService', 'CheckInService', '$mdDialog', '$location', '$routeParams', function (RideDetailService, UserService, CheckInService, $mdDialog, $location, $routeParams) {
    console.log('CheckInController created');
    let self = this;
    let rideId = $routeParams.rideId;
    
    self.ride = CheckInService.ride;

    self.riders = CheckInService.riders;

    self.markRideComplete = function () {
        CheckInService.markRideComplete(rideId)
            .then(() => {
                $location.path('/ride-leader/my-rides');
            });
    }

    CheckInService.getRidersForCurrentRide(rideId);

    self.currentRide = function (rideId) {
        CheckInService.currentRide(rideId);
    };
    self.currentRide(rideId);
}]);