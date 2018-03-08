myApp.controller('CheckInController', ['RideDetailService', 'UserService', 'CheckInService', '$mdDialog', '$location', '$routeParams', function (RideDetailService, UserService, CheckInService, $mdDialog, $location, $routeParams) {
    console.log('CheckInController created');
    let self = this;
    let rideId = $routeParams.rideId;

    self.ride = CheckInService.ride;

    self.riders = CheckInService.riders;

    self.markRideComplete = function () {
        CheckInService.markRideComplete(rideId)
            .then(() => {
                return $location.path('/ride-leader/my-rides');
            })
            .catch((err)=>{
                alert('Error marking ride complete! ', err);
            })
            .finally(() => {
                alert('Ride Complete! All riders will receive their mileage automatically.')
            });
    }

    CheckInService.getRidersForCurrentRide(rideId);

    self.currentRide = function (rideId) {
        CheckInService.currentRide(rideId);
    };
    self.currentRide(rideId);

    self.addRider = function(){
        let answer = confirm('Is the rider a TCBC member?');
        if (answer) {
            CheckInService.addMemberToRide();
        } else{
            CheckInService.addGuestToRide();
        };
    }

    self.toggleCheckedIn = function(rider){
        CheckInService.toggleCheckedIn(rider);
    }

}]);