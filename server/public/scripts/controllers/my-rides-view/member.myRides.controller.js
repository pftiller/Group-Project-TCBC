myApp.controller('MemberMyRidesController', ['RideDetailService', '$mdDialog', function(RideDetailService, $mdDialog) {
    console.log('MemberMyRidesController created');
    let self = this;

    self.rideDetailReveal = function(ride){
        RideDetailService.myRideDetailModal(ride);
    }
    self.rideDetailRevealPast = function(ride){
        RideDetailService.myRideDetailModal(ride);
    }
    
    self.rides = RideDetailService.rides;

  }]);
  

