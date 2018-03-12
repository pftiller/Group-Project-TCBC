myApp.controller('AdminController', ['$timeout', 'Upload', '$http', 'AdminService', 'RideDetailService', function ($timeout, Upload, $http, AdminService, RideDetailService) {
    console.log('AdminController created');
    let self = this;
    self.pendingApprovals = {};

    self.loadRidesForApproval = function () {
        AdminService.getPendingApprovedRides().then((response) => {
            console.log('Controller, got the rides pending approval: ', response);
            self.pendingApprovals.list = response;
        })
    }
    self.loadRidesForApproval();

    self.rideDetailReveal = function (ride) {
        console.log('ride to edit: ', ride);

        RideDetailService.adminEditRideDetailModal(ride);
    }
    self.approveRide = function (rideId) {
        console.log('ride to be approved: ', rideId);
        AdminService.approveRide(rideId).then((response) => {
                console.log('service back after successully approving ride: ', response);
                swal("Ride has been Approved", '', "success");
                self.loadRidesForApproval();
            })
            .catch((err) => {
                console.log('failure to approve ride: ', err);

            })
    }

    self.getRoles = function () {
        console.log('in get roles');
        AdminService.getRoles().then((response) => {
                console.log('service back with roles:', response);
                self.getUserRoles = AdminService.getUserRoles;
            })
            .catch((err) => {
                console.log('did not get user roles', err);
            })
    }
    self.getRoles();

    self.findRider = function (rider) {
        console.log('in find rider', rider);
        AdminService.findRider(rider).then((response) => {
                self.riderInfo = AdminService.riderInfo;
                console.log(self.riderInfo);
            })
            .catch((err) => {
                console.log('did not get rider', err);
            })
    }
                  self.submit = function (file) {
                      Upload.upload({
                          url: '/api/user',
                          data: {file: file}
                      }).then(function (response) {
                          console.log('Success ' + response.config.data.file.name + 'uploaded. Response: ' + response.data);
                      }, function (resp) {
                          console.log('Error status: ' + response.status);
                      });
                  };
    
    
    
        }]);