myApp.controller('AdminController', ['AdminService','RideDetailService', function (AdminService, RideDetailService) {
    console.log('AdminController created');
    let self = this;
    self.pendingApprovals = {};
    
    self.loadRidesForApproval = function(){
        AdminService.getPendingApprovedRides().then((response)=>{
            console.log('Controller, got the rides pending approval: ', response);
            self.pendingApprovals.list = response;
        })
    }
    self.loadRidesForApproval();

    self.rideDetailReveal = function(ride){
        RideDetailService.myRideDetailModal(ride);
    }





}]);