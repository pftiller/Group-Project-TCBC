myApp.controller('RideLeaderController', ['RideDetailService', 'UserService', 'CheckInService', '$mdDialog', '$location', function (RideDetailService, UserService, CheckInService, $mdDialog, $location) {
    console.log('RideLeaderController created');
    let self = this;

    self.leadRidesTable = true;
    self.myRidesTable = true;
    self.pastRidesTable = true;

    self.userObject = UserService.userObject;
    // self.user_id = self.userObject.user_id;

    self.rideDetailReveal = function (ride) {
        RideDetailService.initMyRideDetailModal(ride);
    }

    self.rideDetailRevealPast = function (ride) {
        ride.past_ride = true;
        RideDetailService.initMyRideDetailModal(ride);
    }

    self.cancelRide = function (ride) {
        RideDetailService.cancelThisRide(ride).then(()=>{
            RideDetailService.getMyLeadRideDetails();
        })
    }

    self.createNewRide = function () {
        RideDetailService.createNewRide();
    }

    self.allRides = RideDetailService.allRides;
    self.myRides = RideDetailService.myRides;
    self.myLeadRides = RideDetailService.myLeadRides;
    self.myPastRides = RideDetailService.myPastRides;

    self.checkRidersIn = function (ride) {
        $location.path(`/check-in/${ride.ride_id}`)
    }

    // RideDetailService.getRideCategories();
    RideDetailService.getMyLeadRideDetails();
    RideDetailService.getMyPastRideDetails();
    RideDetailService.getMyRideDetails();
    RideDetailService.getRideCategories();
    RideDetailService.getAllRideDetails();

    self.collapseLeadRides = function () {
        self.leadRidesTable = !self.leadRidesTable;
    }
    self.collapseMyRides = function () {
        self.myRidesTable = !self.myRidesTable;
    }
    self.collapsePastRides = function () {
        self.pastRidesTable = !self.pastRidesTable;
    }
}]);