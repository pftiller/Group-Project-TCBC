myApp.controller('HomeController', ['RideDetailService','$scope', 'myAppFactory', function (RideDetailService, $scope, myAppFactory) {
  console.log('HomeController created');
  let self = this;
  self.rides = {};
  self.categories = {};
  self.isDisabled = false;
  self.minDateString = moment().format('LL');
  self.filter = {};
  

$scope.allRides = {
    data: [],
    sort: {
      predicate: 'date',
      direction: 'asc'
    }
    
};
// myAppFactory.getData().then(function (responseData) {
//     $scope.gridOptions.data = responseData.data;
// });

self.value = function() {
  console.log('here is the value', self.filter.category);
}

  // GET categories on page load
  self.loadCategories = function(){
    RideDetailService.getRideCategories()
      .then((response)=>{
        self.categories.list = response;
      })
  }
  self.loadCategories();
  
  //GET all rides for display
  self.getAllRides = function(){
    RideDetailService.getAllRideDetails()
      .then((response)=>{
        // self.rides.list.foreach(ride=>{
        //     if (ride.cancelled) {
        //       rid
        //     }
        // })
        console.log('here is the response to the controller ', response);
        $scope.allRides.data = response.data;
        // self.rides.list = response;

      })
  }
  // self.getAllRides();
  
// Ride Details
self.rideDetailReveal = function (id) {
  RideDetailService.rideDetailModal(id);
}

// Clear Filters
self.clearFilters = function () {
  self.filter = {};
}


let init = function () {
  self.getAllRides();
};
init();

}]).factory('myAppFactory', function ($http) {
  return {
      getData: function () {
          return $http({
              method: 'GET',
              url: 'https://angular-data-grid.github.io/demo/data.json'
          });
      }
  }
});

