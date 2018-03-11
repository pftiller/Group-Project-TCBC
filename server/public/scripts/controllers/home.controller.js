myApp.controller('HomeController', ['RideDetailService','$scope', function (RideDetailService, $scope) {
  console.log('HomeController created');
  let self = this;
  self.rides = {};
  self.test = RideDetailService.rides;
  self.categories = {};
  self.isDisabled = false;
  self.minDateString = moment().format('LL');
  let filter = {};
  

$scope.allRidesOptions = {
    data: [],
    sort: {
      predicate: 'date',
      direction: 'asc'
    },
    customFilters: {
      date: function (items, value, predicate) {
          return items.filter(function (item) {
              return value && item[predicate] ? !item[predicate].indexOf(moment(value).format('MM/DD/YYYY')) : true;
          });
      }
    }
  };

$scope.allRidesActions = {

}

self.logDate = function() {
  console.log($scope.date);
}
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
        $scope.allRidesOptions.data = response.data;
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
  date = '';
  type = '';
  rides_name ='';
  filter = {};
}


let init = function () {
  self.getAllRides();
};
init();

}])