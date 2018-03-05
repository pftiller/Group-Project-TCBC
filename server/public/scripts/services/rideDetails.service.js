myApp.service('RideDetailService', ['$http', '$location', function ($http, $location) {
    console.log('RideDetailService Loaded');
    let self = this;
    self.rides = {
        list: []
    }
    self.getRideDetails = function () {
        return $http.get('/rideDetails')
            .then((response) => {
                console.log(response.data);
                self.rides.list = response.data.details;
            })
            .catch((err) => {
                console.log(err);
            })
    }

    self.getRideDetails();
}]);