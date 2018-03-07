myApp.service('AdminService', ['$http', '$location', function ($http, $location) {
    console.log('AdminService Loaded');
    let self = this;
    


    self.getPendingApprovedRides = function(){

        return $http.get('/rides/admin/pendingApprovedRides')
                .then((response) => {
                    console.log('Service, rides pending approval came back: ', response.data );
                    return response.data;
                })
                .catch((err)=>{
                    console.log('Error getting rides pending approval: ', err);
                    
                })


    }



}]);