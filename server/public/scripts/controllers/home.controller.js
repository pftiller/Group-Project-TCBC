myApp.controller('HomeController', ['RideDetailService', '$timeout', '$q', '$log', function (RideDetailService, $timeout, $q, $log) {
  console.log('HomeController created');
  let self = this;
  self.rides = RideDetailService.rides;
  self.categories = RideDetailService.categories;
  self.isOpen = false;
  self.querySearch   = querySearch;
    self.simulateQuery = false;
    self.isDisabled = false;
    // list of `state` value/display objects
    // self.stations = loadAll($http);
    self.querySearch = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange = searchTextChange;

    //self.newState = newState;

    function querySearch(query) {
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

    function searchTextChange(text) {
      $log.info('Text changed to ' + text);
    }

    function selectedItemChange(item) {
      $log.info('Item changed to ' + JSON.stringify(item));
    }

    // function loadAll($http) {
    //   var allStations = [];
    //   var result = [];
    //   $http.get('/Train/GetAllStations')
    //     .then(function(response) {
    //       allStations = response.data;
    //       angular.forEach(allStations, function(station, key) {
    //         result.push({
    //           value: station.StationName.toLowerCase(),
    //           display: station.StationName
    //         });
    //       })
    //     });
    //   return result;
    // }

    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(state) {
        return (state.value.indexOf(lowercaseQuery) === 0);
      };

    }
  












  self.rideDetailReveal = function (ride) {
    RideDetailService.loadWelcomeModal(ride);
  }
  // Date Picker

  self.today = function () {
    self.date = new Date();
  };
  self.today();

  self.clear = function () {
    self.date = null;
  };


  // Live Search
  // self.querySearch = function(query) {
  //   var results = query ? self.states.filter(createFilterFor(query)) : self.states,
  //     deferred;
  //   if (self.simulateQuery) {
  //     deferred = $q.defer();
  //     $timeout(function () {
  //       deferred.resolve(results);
  //     }, Math.random() * 1000, false);
  //     return deferred.promise;
  //   } else {
  //     return results;
  //   }
  // }

  function querySearch (query) {
      console.log('search');
        var deferred = $q.defer();
        $timeout(function() {
            deferred.resolve(self.rides);
        }, Math.random() * 500, false);
        return deferred.promise;
    };



  // Category Dropdown Filter
  self.categoryFilter = {};
  self.clearFilters = function () {
    self.categoryFilter = {};
    self.date = null;
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