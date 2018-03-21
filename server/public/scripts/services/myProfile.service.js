myApp.service('MyProfileService', ['$http', '$location', function ($http, $location) {
    let self = this;

    self.viewProfile = function () {
        return $http.get('/member/viewProfile')
            .then(function (response) {
                return response.data;
            })
            .catch(function (response) {
                swal('Error getting member profile from server. Please try again later.', '', 'error');
            });
    } //end getting table data
}]);