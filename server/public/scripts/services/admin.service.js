myApp.service('AdminService', ['$http', '$location', function ($http, $location) {
    console.log('AdminService Loaded');
    let self = this;
    self.getUserRoles = {
        list:[]
    };
    
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

    self.approveRide = function(rideId){
        return $http.put(`/rides/admin/approveRide/${rideId}`)
                .then((response)=>{
                    console.log('ride approved: ', response);
                    return response;
                })
                .catch((err)=>{
                    console.log('ride approval failed: ', err);
                    
                })
    }

    self.getRoles = function() {
        return $http.get('/member/userRole')
        .then((response)=>{
            console.log('got user roles:', response.data);
            self.getUserRoles.list = response.data;
            return response.data;
            
        })
        .catch((err)=>{
            console.log('getting user roles failed:', err);
        })
    }

}]);