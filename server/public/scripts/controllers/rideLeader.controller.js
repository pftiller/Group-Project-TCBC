myApp.controller('RideLeaderController', ['RideDetailService', '$mdDialog', function(RideDetailService, $mdDialog) {
    console.log('RideLeaderController created');
    let self = this;

    self.rideDetailReveal = function(ride){
        RideDetailService.loadWelcomeModal(ride);
    }
    self.rides = RideDetailService.rides;

  }]);
  

