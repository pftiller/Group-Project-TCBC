myApp.controller('HomeController', ['RideDetailService', function (RideDetailService) {
  console.log('HomeController created');
  let self = this;
  self.rides = {};
  self.categories = {};
  self.isDisabled = false;
  self.minDateString = moment().format('LL');
  self.filter = {};
  

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
        self.rides.list = response;
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

}]);