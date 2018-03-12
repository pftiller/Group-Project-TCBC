myApp.controller('HomeController', ['RideDetailService','$scope', '$filter', function (RideDetailService, $scope, $filter) {
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
    }
  };

$scope.allRidesActions = {

}

self.isIndeterminate = function() {
  var selected = $filter('filter')(self.categories.list, {selected: true}).length;
  return selected !== 0 && selected !== self.categories.list.length;
};

self.allChecked = function() {
 return $filter('filter')(self.categories.list, {selected: true}).length === self.categories.list.length;  
};

self.toggleAll = function() {
  var selected = $filter('filter')(self.categories.list, {selected: true}).length;
  var newSelected = selected < self.categories.list.length;
  angular.forEach(self.categories.list, function(item) {
    item.selected = newSelected;   
  });
};

  // GET categories on page load
  self.loadCategories = function(){
    RideDetailService.getRideCategories()
      .then((response)=>{
        self.categories.list = response;
        console.log('here is self.categories.list', self.categories.list);
        console.log('here is the length of self.categories.list', self.categories.list.length);
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