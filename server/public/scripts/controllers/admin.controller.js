myApp.controller('AdminController', ['$timeout', 'Upload', '$http', '$mdDialog', 'AdminService', 'RideDetailService', function ($timeout, Upload, $http, $mdDialog, AdminService, RideDetailService) {
       ('AdminController created');
    let self = this;
    self.pendingApprovals = AdminService.pendingApprovedRides;
    self.rider = AdminService.rider;
    self.member = AdminService.member;

    self.memberToChangePassword = {};
    self.loadRidesForApproval = function () {
        AdminService.getPendingApprovedRides().then((response) => {
            self.pendingApprovals.list = [];
               ('Controller, got the rides pending approval: ', response);
            self.pendingApprovals.list = response;
        })
    }
    self.loadRidesForApproval();

    self.rideDetailReveal = function (ride) {
           ('ride to edit: ', ride);

        RideDetailService.adminEditRideDetailModal(ride);
    }
    self.approveRide = function (rideId) {
           ('ride to be approved: ', rideId);
        AdminService.approveRide(rideId).then((response) => {
                   ('service back after successully approving ride: ', response);
                swal("Ride has been Approved", '', "success");
                self.loadRidesForApproval();
            })
            .catch((err) => {
                   ('failure to approve ride: ', err);

            })
    }

    self.getRoles = function () {
           ('in get roles');
        AdminService.getRoles().then((response) => {
                   ('service back with roles:', response);
                self.getUserRoles = AdminService.getUserRoles;

            })
            .catch((err) => {
                   ('did not get user roles', err);
            })
    }
    self.getRoles();

    self.findRider = function (rider) {
           ('in find rider', rider);
        AdminService.findRider(rider).then((response) => {
                self.riderInfo = AdminService.riderInfo;
                   (self.riderInfo);
                self.rider = {
                    first_name: '',
                    last_name: '',
                    member_id: ''
                }
            })
            .catch((err) => {
                   ('did not get rider', err);
            })
    }

    self.changeRole = function (member) {
           ('in change role ', member);
        AdminService.changeRole(member)
            .then((response) => {
                self.roleChange = AdminService.roleChange;
                AdminService.findRider(member);
                   (self.roleChange);
                self.userRole = '';
            })
            .catch((err) => {
                   ('did not change role', err);
            })
    }

    self.submit = function (file) {
        Upload.upload({
                url: '/upload',
                data: {
                    file: file
                }
            }).then(function (response) {
                swal("Member records updated", '', "success");
                   ('Success ' + response.config.data.file.name + 'uploaded. Response: ' + response.data);
            })
            .catch((err) => {
                   ('err on submit upload ', err);
                swal('Error updating member records.', '', 'error');
                   ('Error status: ' + err.status);
            });
    };


    self.adminViewMemberPastRides = function (member, ev) {
        AdminService.adminViewMemberPastRides(member)
            .then((response) => {
                   (self.pastMemberRides);
            })
            .catch((err) => {
                   ('did not get user past rides ', err);
            })
    }

    self.openChangePasswordModal = function (ev, member) {
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

    function ChangePasswordController($mdDialog, user, AdminService) {
        const self = this;
           ('ChangePasswordController loaded');
           ('change password for this User: ', user);
        self.editUser = user;
        self.passwordFail = false;
        self.submitForm = function (password) {
            if (password.newPassword !== password.confirm) {
                self.passwordFail = true;
            } else {
                   ('passwords match: ', password);
                user.newPassword = password.newPassword;
                   ('user password will be: ', user);
                AdminService.changePassword(user)
                    .then((result) => {
                        swal(`Successfully changed password for ${user.first_name}`, '', 'success');
                           ('result of password change: ', result);
                        $mdDialog.hide();
                    });
            }
        }
        
        self.closeModal = function () {
            $mdDialog.hide();
        }

    }

    self.upload = function () {
    angular.element(document.querySelector('#fileInput')).click();
  };


}]);