myApp.controller('AdminController', ['$timeout', 'Upload', '$http', '$mdDialog', 'AdminService', 'RideDetailService', function ($timeout, Upload, $http, $mdDialog, AdminService, RideDetailService) {
    console.log('AdminController created');
    let self = this;
    self.pendingApprovals = AdminService.pendingApprovedRides;
    self.rider = AdminService.rider;
    self.member = AdminService.member;

    self.memberToChangePassword = {};
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
                self.rider = {
                    first_name: '',
                    last_name: '',
                    member_id: ''
                }
            })
            .catch((err) => {
                console.log('did not get rider', err);
            })
    }

    self.changeRole = function (role_name, member) {
        console.log('in change role ', role_name, member);
        AdminService.changeRole(role_name, member)
            .then((response) => {
                self.roleChange = AdminService.roleChange;
                AdminService.findRider(member);
                console.log(self.roleChange);
                self.userRole = '';
            })
            .catch((err) => {
                console.log('did not change role', err);
            })
    }
    self.submit = function (file) {
        self.csvUpload = true;
        if (file != null) {
          self.upload(file);
        }
      };
    

      self.upload = function (file) {
        file.upload = Upload.http({
            url: '/upload',
            file: file
            });
            file.upload.then(function (response) {
                if (response.status === 200) {
                    swal("Member records updated", '', "success");
                    console.log('Success ' + response.config.data.file.name + 'uploaded. Response: ' + response.data);
                } else {
                    swal('Error updating member records.', '', 'error');
                    console.log('Error on submit upload ', err  + resp.status);
                }
             
            })
            file.upload.progress(function (evt) {
              file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
          }

    self.adminViewMemberPastRides = function(member){
        AdminService.adminViewMemberPastRides(member);
    };
    
    self.openChangePasswordModal = function(ev, member){
        $mdDialog.show({
            controller: ChangePasswordController,
            controllerAs: 'vm',
            templateUrl: '../views/admin/templates/changePassword-modal.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: false,
            resolve: {
                user: function () {
                    return member;
                }
            }
        })
    }
}]);