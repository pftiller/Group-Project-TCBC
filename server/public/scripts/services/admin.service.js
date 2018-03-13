myApp.service('AdminService', ['$http', '$location', function ($http, $location) {
    console.log('AdminService Loaded');
    let self = this;
    self.pendingApprovedRides = { list: [] };
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

    self.getPendingApprovedRides = function () {
        return $http.get('/rides/admin/pendingApprovedRides')
            .then((response) => {
                console.log('Service, rides pending approval came back: ', response.data);
                self.pendingApprovedRides.list = response.data;
                return response.data;
            })
            .catch((err) => {
                console.log('Error getting rides pending approval: ', err);
            })
    }

    self.getRoles = function () {
        return $http.get('/member/userRole')
            .then((response) => {
                console.log('got user roles:', response.data);
                self.getUserRoles.list = response.data;
                return response.data;

            })
            .catch((err) => {
                console.log('getting user roles failed:', err);
            })
    }
    self.findRider = function (rider) {
        if (rider.member_id == '') {
            rider.member_id = 0
        }
        if (rider.first_name == '') {
            rider.first_name = 'First';
        }
        if (rider.last_name == '') {
            rider.last_name = 'Last';
        }
        return $http.get(`/member/findRider/riderInfo/${rider.first_name}/${rider.last_name}/${rider.member_id}`)
            .then((response) => {
                console.log('search member response ', response);
                self.riderInfo.list = response.data;
                self.rider = {
                    first_name: '',
                    last_name: '',
                    member_id: ''
                }
            })
            .catch((err) => {
                console.log('getting role failed:', err);
            })
    }

    self.changeRole = function (role_name, member_id) {
        console.log('role name', role_name);
        return $http.put(`/member/changeRole/${member_id}`, role_name)
            .then((response) => {
                console.log('role response ', response);
                self.roleChange.list = response;
                return response;
            })
            .catch((err) => {
                console.log('role change failed: ', err);

            })
    }

    self.viewPastRides = function (member_id, ev) {
        $mdDialog.show({
            controller: MyPastRidesController,
            controllerAs: 'vm',
            templateUrl: '../views/admin/templates/editRide-modal.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            resolve: {
                item: function () {
                    return ride;
                }
            }
        })
    }


}]);