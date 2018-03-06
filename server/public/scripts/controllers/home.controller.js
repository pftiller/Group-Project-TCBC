myApp.controller('HomeController', ['RideDetailService', '$timeout', '$q', '$log', function (RideDetailService, $timeout, $q, $log) {
  console.log('HomeController created');
  let self = this;
  self.rides = RideDetailService.rides;
  self.categories = RideDetailService.categories;
  self.isOpen = false;
  self.simulateQuery = false;
  self.isDisabled = false;

  // Ride Name Search
self.querySearch = function(query) {
      var results = query ? self.categories.list.ride_names.filter(createFilterFor(query)) : self.categories.list.ride_names,
        deferred;
      if (!query) {
        return;
      }
      if (self.simulateQuery) {
        deferred = $q.defer();
        $timeout(function() {
          deferred.resolve(results);
        }, Math.random() * 1000, false);
        return deferred.promise;
      } else {
        return results;
      }
    }

    self.searchTextChange = function(text) {
      console.log('Search text changed');
    }

   self.selectedItemChange = function(item) {
      console.log('Selected item changed');
    }

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