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
        Upload.upload({
                url: '/upload',
                data: {
                    file: file
                }
            }).then(function (response) {
                swal("Member records updated", '', "success");
                console.log('Success ' + response.config.data.file.name + 'uploaded. Response: ' + response.data);
            })
            .catch((err) => {
                console.log('err on submit upload ', err);
                swal('Error updating member records.', '', 'error');
                console.log('Error status: ' + resp.status);
            });
    };
    

    self.adminViewMemberPastRides = function (member, ev) {
        AdminService.adminViewMemberPastRides(member)
            .then((response) => {
                console.log(self.pastMemberRides);
            })
            .catch((err) => {
                console.log('did not get user past rides ', err);
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
        console.log('ChangePasswordController loaded');
        console.log('change password for this User: ', user);

        self.passwordFail = false;
        self.submitForm = function (password) {
            if (password.newPassword !== password.confirm) {
                self.passwordFail = true;
            } else {
                console.log('passwords match: ', password);
                user.newPassword = password.newPassword;
                console.log('user password will be: ', user);
                AdminService.changePassword(user)
                    .then((result) => {
                        swal(`Successfully changed password for ${user.first_name}`, '', 'success');
                        console.log('result of password change: ', result);
                        $mdDialog.hide();
                    });
            }



        }

    }









}]);