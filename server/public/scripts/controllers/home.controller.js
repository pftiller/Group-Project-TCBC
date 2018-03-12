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
  //   type: function (items, value, predicate) {
  //     console.log('value in filter:', value);
  //     self.valueInFilter = value;

  //     return items;
  // }
}
  };

$scope.allRidesActions = {

}


$scope.testCats = [
  {id: 1, selected:true, type: 'A', name:'Very Strenuous'},
  {id: 2, selected:true, type: 'A/B', name:'Strenuous'}, 
  {id: 3, selected:true, type: 'B', name:'Brisk'}, 
  {id: 4, selected:true, type: 'B/C', name:'Moderate'},
  {id: 5, selected:true, type: 'C', name:'Relaxed'},
  {id: 6, selected:true, type: 'MB-A', name:'Members Only'},
  {id: 7, selected:true, type: 'MB-AB', name:'Members Only'}, 
  {id: 8, selected:true, type: 'MB-B', name:'Members Only'}, 
  {id: 9, selected:true, type: 'MB-C', name:'Members Only'},
  {id: 10, selected:true, type: 'N-A', name:'Night'},
  {id: 11, selected:true, type: 'N-A/B', name:'Night'},
  {id: 12, selected:true, type: 'N-B', name:'Night'}, 
  {id: 13, selected:true, type: 'N-B/C', name:'Night'}, 
  {id: 14, selected:true, type: 'N-C', name:'Night'},
  {id: 15, selected:true, type: 'O', name:'Outreach'},
  {id: 16, selected:true, type: 'S', name:'Special'}
];

$scope.isIndeterminate = function() {
  var selected = $filter('filter')($scope.testCats, {selected: true}).length;
  return selected !== 0 && selected !== $scope.testCats.length;
};

$scope.allChecked = function() {
 return $filter('filter')($scope.testCats, {selected: true}).length === $scope.testCats.length;  
};

$scope.toggleAll = function() {
  var selected = $filter('filter')($scope.testCats, {selected: true}).length;
  var newSelected = selected < $scope.testCats.length;
  angular.forEach($scope.testCats, function(item) {
    item.selected = newSelected;   
  });
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