myApp.controller('HomeController', ['RideDetailService','$scope', function (RideDetailService, $scope) {
  console.log('HomeController created');
  let self = this;
  self.rides = {};
  self.test = RideDetailService.rides;
  self.categories = {};
  self.isDisabled = false;
  self.minDate = new Date();
  self.selection = [];

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
      },
    type: function (items, value, predicate) {
      console.log('value in filter:', value);
      self.valueInFilter = value;

      return items;
  }
}
  };

$scope.allRidesActions = {

}

self.toggleSelection = function(category) {
  var idx = self.selection.indexOf(category);
  if (idx > -1) {
    self.selection.splice(idx, 1);
  }
  else {
    self.selection.push(category);
  }
};

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
  $scope.date = '';
  $scope.type = '';
  $scope.rides_name ='';
}


let init = function () {
  self.getAllRides();

};
init();

}])