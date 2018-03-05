myApp.controller('MemberMyRidesController', ['RideDetailService', '$mdDialog', function(RideDetailService, $mdDialog) {
    console.log('MemberMyRidesController created');
    let self = this;

    self.rideDetailReveal = function(ride){
        RideDetailService.loadWelcomeModal(ride);
    }
    self.rides = RideDetailService.rides;

  }]);
  

