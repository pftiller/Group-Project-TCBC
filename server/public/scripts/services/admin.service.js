myApp.service('AdminService', ['$http', '$location', function ($http, $location) {
    console.log('AdminService Loaded');
    let self = this;
    self.getUserRoles = {
        list: []
    };
    self.riderInfo = {
        list: []
    };

    self.getMember = {
        first_name: '',
        last_name: '',
        member_id: ''
    };

    self.roleChange = {
        list: []
    };

    self.getPendingApprovedRides = function () {
        return $http.get('/rides/admin/pendingApprovedRides')
            .then((response) => {
                console.log('Service, rides pending approval came back: ', response.data);
                return response.data;
            })
            .catch((err) => {
                console.log('Error getting rides pending approval: ', err);
            })
    }

    self.approveRide = function (rideId) {
        return $http.put(`/rides/admin/approveRide/${rideId}`)
            .then((response) => {
                console.log('ride approved: ', response);
                return response;
            })
            .catch((err) => {
                console.log('ride approval failed: ', err);

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
    self.findRider = function (member) {
        console.log('member search for ', self.getMember);
        if (member.member_id == '') {
            member.member_id = 0
        }
        if (member.first_name == '') {
            member.first_name = 'First';
        }
        if (member.last_name == '') {
            member.last_name = 'Last';
        }
        return $http.get(`/member/findRider/riderInfo/${member.first_name}/${member.last_name}/${member.member_id}`)
            .then((response) => {
                console.log('search member response ', response);
                self.riderInfo.list = response.data;
                self.getMember = {
                    first_name: '',
                    last_name: '',
                    member_id: ''
                }
            })
            .catch((err) => {
                console.log('getting role failed:', err);
            })
    }

    self.changeRole = function () {
        return $http.put(`/member/changeRole`)
            .then((response) => {
                console.log('role response ', response);
                self.roleChange.list = response;
                return response;
            })
            .catch((err) => {
                console.log('role change failed: ', err);

            })
    }

}]);