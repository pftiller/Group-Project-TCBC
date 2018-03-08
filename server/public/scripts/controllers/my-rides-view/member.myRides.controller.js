myApp.controller('MemberMyRidesController', ['RideDetailService', '$mdDialog', function(RideDetailService, $mdDialog) {
    console.log('MemberMyRidesController created');
    let self = this;

    self.rideDetailReveal = function(ride){
        RideDetailService.initMyRideDetailModal(ride);
    }

    self.rideDetailRevealPast = function(ride){
        RideDetailService.initMyRideDetailModal(ride);
    }
    
    self.rides = RideDetailService.rides;
    self.myRides = RideDetailService.myRides;

  }]);
  

