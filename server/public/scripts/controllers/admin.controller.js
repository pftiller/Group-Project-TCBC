myApp.controller('AdminController', ['$timeout', 'Upload', '$http', '$mdDialog', 'AdminService', 'RideDetailService', function ($timeout, Upload, $http, $mdDialog, AdminService, RideDetailService) {
<<<<<<< HEAD
       ('AdminController created');
=======
>>>>>>> 6307b5aec85ae800210ad8cbe29886bbfd896648
    let self = this;
    self.pendingApprovals = AdminService.pendingApprovedRides;
    self.rider = AdminService.rider;
    self.member = AdminService.member;

    self.memberToChangePassword = {};
    self.loadRidesForApproval = function () {
        AdminService.getPendingApprovedRides().then((response) => {
            self.pendingApprovals.list = [];
<<<<<<< HEAD
               ('Controller, got the rides pending approval: ', response);
=======
>>>>>>> 6307b5aec85ae800210ad8cbe29886bbfd896648
            self.pendingApprovals.list = response;
        })
    }
    self.loadRidesForApproval();

    self.rideDetailReveal = function (ride) {
<<<<<<< HEAD
           ('ride to edit: ', ride);

        RideDetailService.adminEditRideDetailModal(ride);
    }
    self.approveRide = function (rideId) {
           ('ride to be approved: ', rideId);
        AdminService.approveRide(rideId).then((response) => {
                   ('service back after successully approving ride: ', response);
=======
        RideDetailService.adminEditRideDetailModal(ride);
    }
    self.approveRide = function (rideId) {
        AdminService.approveRide(rideId).then((response) => {
>>>>>>> 6307b5aec85ae800210ad8cbe29886bbfd896648
                swal("Ride has been Approved", '', "success");
                self.loadRidesForApproval();
            })
            .catch((err) => {
<<<<<<< HEAD
                   ('failure to approve ride: ', err);

=======
                swal('Error approving ride. Please try again later', '', 'error');
>>>>>>> 6307b5aec85ae800210ad8cbe29886bbfd896648
            })
    }

    self.getRoles = function () {
<<<<<<< HEAD
           ('in get roles');
        AdminService.getRoles().then((response) => {
                   ('service back with roles:', response);
=======
        AdminService.getRoles().then((response) => {
>>>>>>> 6307b5aec85ae800210ad8cbe29886bbfd896648
                self.getUserRoles = AdminService.getUserRoles;

            })
            .catch((err) => {
<<<<<<< HEAD
                   ('did not get user roles', err);
=======
                swal('Error getting roles from server. Please try again later.', '', 'error');
>>>>>>> 6307b5aec85ae800210ad8cbe29886bbfd896648
            })
    }
    self.getRoles();

    self.findRider = function (rider) {
<<<<<<< HEAD
           ('in find rider', rider);
        AdminService.findRider(rider).then((response) => {
                self.riderInfo = AdminService.riderInfo;
                   (self.riderInfo);
=======
        AdminService.findRider(rider).then((response) => {
                self.riderInfo = AdminService.riderInfo;
>>>>>>> 6307b5aec85ae800210ad8cbe29886bbfd896648
                self.rider = {
                    first_name: '',
                    last_name: '',
                    member_id: ''
                }
            })
            .catch((err) => {
<<<<<<< HEAD
                   ('did not get rider', err);
=======
                swal('Error getting rider information. Please try again later.', '', 'error');
>>>>>>> 6307b5aec85ae800210ad8cbe29886bbfd896648
            })
    }

    self.changeRole = function (member) {
<<<<<<< HEAD
           ('in change role ', member);
=======
>>>>>>> 6307b5aec85ae800210ad8cbe29886bbfd896648
        AdminService.changeRole(member)
            .then((response) => {
                self.roleChange = AdminService.roleChange;
                AdminService.findRider(member);
<<<<<<< HEAD
                   (self.roleChange);
                self.userRole = '';
            })
            .catch((err) => {
                   ('did not change role', err);
=======
                self.userRole = '';
            })
            .catch((err) => {
                swal('Error changing member role. Please try again later.', '', 'error');
>>>>>>> 6307b5aec85ae800210ad8cbe29886bbfd896648
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
<<<<<<< HEAD
                   ('err on submit upload ', err);
                swal('Error updating member records.', '', 'error');
                   ('Error status: ' + err.status);
=======
                swal('Error updating member records. Please try again later.', '', 'error');
>>>>>>> 6307b5aec85ae800210ad8cbe29886bbfd896648
            });
    };


    self.adminViewMemberPastRides = function (member, ev) {
        AdminService.adminViewMemberPastRides(member)
            .then((response) => {
                   (self.pastMemberRides);
            })
            .catch((err) => {
<<<<<<< HEAD
                   ('did not get user past rides ', err);
=======
                swal('Error getting rider past rides. Please try again later.', '', 'error');
>>>>>>> 6307b5aec85ae800210ad8cbe29886bbfd896648
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
<<<<<<< HEAD
           ('ChangePasswordController loaded');
           ('change password for this User: ', user);
=======
>>>>>>> 6307b5aec85ae800210ad8cbe29886bbfd896648
        self.editUser = user;
        self.passwordFail = false;
        self.submitForm = function (password) {
            if (password.newPassword !== password.confirm) {
                self.passwordFail = true;
            } else {
<<<<<<< HEAD
                   ('passwords match: ', password);
                user.newPassword = password.newPassword;
                   ('user password will be: ', user);
                AdminService.changePassword(user)
                    .then((result) => {
                        swal(`Successfully changed password for ${user.first_name}`, '', 'success');
                           ('result of password change: ', result);
=======
                user.newPassword = password.newPassword;
                AdminService.changePassword(user)
                    .then((result) => {
                        swal(`Successfully changed password for ${user.first_name}`, '', 'success');
>>>>>>> 6307b5aec85ae800210ad8cbe29886bbfd896648
                        $mdDialog.hide();
                    })
                    .catch((err)=>{
                        swal('Error changing member information. Please try again later.', '', 'error');
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