myApp.controller('HomeController', ['RideDetailService', '$timeout', '$q', '$log', function (RideDetailService, $timeout, $q, $log) {
  console.log('HomeController created');
  let self = this;
  self.rides = RideDetailService.rides;
  self.categories = RideDetailService.categories;
  self.isOpen = false;
  self.simulateQuery = false;
  self.isDisabled = false;


  // fetch categories on page load
  self.loadCategories = function(){
    RideDetailService.getRideCategories()
      .then((response)=>{
        self.categories.list = response;
      })
  }
  self.loadCategories();

// Ride Details
self.rideDetailReveal = function (ride) {
  RideDetailService.myRideDetailModal(ride);
}

// Clear Filters
  self.clearFilters = function () {
    self.query.date = '';
    self.query.name = '';
    self.query.category = '';
  }

  // Table Sorting 
  self.sort = {
    active: '',
    descending: undefined
  }

  self.changeSorting = function (column) {
    var sort = self.sort;
    if (sort.active == column) {
      console.log(sort.active);
      sort.descending = !sort.descending;
    } else {
      sort.active = column;
      sort.descending = false;
    }
  };

  self.getIcon = function (column) {
    var sort = self.sort;
    if (sort.active == column) {
      return sort.descending ?
        'arrow_drop_down' :
        'arrow_drop_up';
    }
  }
}]);