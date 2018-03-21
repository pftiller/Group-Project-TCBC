myApp.service('AdminService', ['$http', '$location', '$mdDialog', function ($http, $location, $mdDialog) {
    let self = this;
    self.pendingApprovedRides = {
        list: []
    };
    self.getUserRoles = {
        list: []
    };
    self.riderInfo = {
        list: []
    };

    self.rider = {
        first_name: '',
        last_name: '',
        member_id: ''
    };

    self.roleChange = {
        list: {}
    };

    self.pastMemberRides = {
        list: []
    };

    self.getPendingApprovedRides = function () {
        return $http.get('/rides/admin/pendingApprovedRides')
            .then((response) => {
                self.pendingApprovedRides.list = [];
                response.data.forEach(ride => {
                    let momentDate = moment(ride.rides_date);
                    ride.date = momentDate.format('MM/DD/YYYY');
                    ride.time = momentDate.format('hh:mm A');
                    self.pendingApprovedRides.list.push(ride);
                });
                return response.data;
            })
            .catch((err) => {
                swal('Error getting pending approved ride information. Please try again later.', '', 'error');
            })
    }

    self.getRoles = function () {
        return $http.get('/member/userRole')
            .then((response) => {
                let dropGuestRole = response.data;
                //this fix to remove guest won't scale. just a quick fix.
                dropGuestRole.pop();
                self.getUserRoles.list = dropGuestRole;
                return response.data;
            })
            .catch((err) => {
                swal('Error getting member role information. Please try again later.', '', 'error');
            })
    }

    self.findRider = function (rider) {
        if (rider.member_id == '') {
            rider.member_id = 0
        }
        if (rider.first_name == '') {
            rider.first_name = 'QWERTYPHONE';
        }
        if (rider.last_name == '') {
            rider.last_name = 'BANANAJAMMA';
        }
        return $http.get(`/member/findRider/riderInfo/${rider.first_name}/${rider.last_name}/${rider.member_id}`)
            .then((response) => {
                self.riderInfo.list = response.data;
                self.rider = {
                    first_name: '',
                    last_name: '',
                    member_id: ''
                }
            })
            .catch((err) => {
                swal('Error finding rider. Please try again later.', '', 'error');
            })
    }

    self.changeRole = function (member) {
        return $http.put(`/member/changeRole`, member)
            .then((response) => {
                if (response) {
                    swal(`User role was successfully updated!`, {
                        icon: "success",
                    });
                    self.roleChange.list = response;
                    return response;
                }
            })
            .catch((err) => {
                swal('Error updating user role.', '', 'error');
            });
    }

    self.adminViewMemberPastRides = function (member, ev) {
        return $http.get(`/member/adminViewMemberPastRides/${member.user_id}`)
            .then((response) => {
                $mdDialog.show({
                    controller: MyPastRidesController,
                    controllerAs: 'vm',
                    templateUrl: '../views/admin/partials/modal-template.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    resolve: {
                        item: function () {
                            return member;
                        }
                    }
                })
                self.pastMemberRides.list = response.data;
                return response;
            })
            .catch((err) => {
                swal('Error getting past rides for member. Please try again later.', '', 'error');
            })
    }

    function MyPastRidesController($mdDialog, item, AdminService) {
        const self = this;
        self.mode = {
            show: true,
            edit: false
        }
        self.closeModal = function () {
            $mdDialog.hide();
        }
        self.pastMemberRides = AdminService.pastMemberRides;
        self.member = item;
        self.backModal = function () {
            self.mode.edit = false;
            self.mode.show = true;
        }

        self.editSinglePastRide = function (ride) {
            self.pastRideInfo = {
                member: self.member,
                ride: ride
            }
            self.mode = {
                show: false,
                edit: true
            }

            self.member = self.pastRideInfo.member;
            self.ride = self.pastRideInfo.ride;

            self.editRideActualMileage = function (mileage) {
                let mileUpdate = {
                    ride_id: self.ride.ride_id,
                    user_id: self.member.user_id,
                    mileage: mileage
                }
                AdminService.editRideActualMileage(mileUpdate)
                    .then(() => {
                        self.closeModal()
                    })
                    .catch((err) => {
                        swal('Error editing rider mileage. Please try again later.', '', 'error');
                    });
            }
        }
    }

    function SinglePastRideEditController($mdDialog, item, AdminService) {
        const self = this;

    }

    self.changePassword = function (user) {
        return $http.post('/api/user/admin/changePassword', user)
            .then((result) => {
                return result;
            })
            .catch((err) => {
                swal('Error changing member password. Please try again later.', '', 'error');
            })
    }

    self.editRideActualMileage = function (mileUpdate) {
        return $http.put('/rides/admin/editRide/actualMileage', mileUpdate)
            .then((response) => {
                swal(`Successfully updated user mileage!`, '', 'success');
            })
            .catch((err) => {
                swal(`Could not update user mileage, please try again later.`, '', 'error');
            })
    }

}]);