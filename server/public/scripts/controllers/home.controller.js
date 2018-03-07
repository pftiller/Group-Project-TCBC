myApp.controller('HomeController', ['RideDetailService', function (RideDetailService) {
  console.log('HomeController created');
  let self = this;
  self.rides = {};
  self.categories = {};
  self.isDisabled = false;
  self.minDateString = moment().format('LL');

  
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
        self.rides.list = response;
      })
  }
  self.getAllRides();
  
// Ride Details
self.rideDetailReveal = function (ride) {
  RideDetailService.rideDetailModal(ride);
}

// Clear Filters
self.clearFilters = function () {
  self.query.name = '';
  self.query.category = '';
  self.selectedDate = '';
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