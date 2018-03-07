myApp.service('myProfileService', ['$http', '$location', function ($http, $location) {
    console.log('myProfileService Loaded');
    let self = this;
    self.viewProfile = {
        list: {}
    };

    // getting user profile for user my profile view from member_info table in database
    self.viewProfile = function () {
        return $http.get('/member/viewProfile')
            .then(function (response) {
                console.log(response);
                self.viewProfile.list = response.data;
            })
            .catch(function (response) {
                console.log('error on get request');
            });
    } //end getting table data
}]);