myApp.controller('HomeController', ['RideDetailService','$scope', '$rootScope', '$element', '$filter', '$location', 'filtersFactory', function (RideDetailService, $scope, $rootScope, $element, $filter, $location, filtersFactory) {
  console.log('HomeController created');
  let self = this;
  self.rides = {};
  self.test = RideDetailService.rides;
  self.categories = {};
  self.isDisabled = false;
  self.minDate = new Date();
  self.selection = [];

$scope.gridOptions = {
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

$scope.gridActions = {

}
$scope._gridOptions = $scope.$eval($element.attr('grid-options'));
            $scope._gridActions = $scope.$eval($element.attr('grid-actions'));
            // $scope.serverPagination = $element.attr('server-pagination') === 'true';
            // $scope.getDataDelay = $element.attr('get-delay') || 350;

            if (!$scope._gridActions) {
                $scope.$parent.$eval($element.attr('grid-actions') + '= {}');
                $scope._gridActions = $scope.$parent.$eval($element.attr('grid-actions'));
            }

            $scope._gridOptions.grid = $scope;

            $scope.filtered = $scope._gridOptions.data.slice();
            $scope.paginationOptions = $scope._gridOptions.pagination ? angular.copy($scope._gridOptions.pagination) : {};
            $scope.defaultsPaginationOptions = {
                itemsPerPage: $scope.paginationOptions.itemsPerPage,
                currentPage: $scope.paginationOptions.currentPage || 1
            };
            $scope.paginationOptions = angular.copy($scope.defaultsPaginationOptions);
            $scope.sortOptions = $scope._gridOptions.sort ? angular.copy($scope._gridOptions.sort) : {};
            $scope.customFilters = $scope._gridOptions.customFilters ? angular.copy($scope._gridOptions.customFilters) : {};
            $scope.urlSync = $scope._gridOptions.urlSync;

            $scope.$watchCollection('_gridOptions.data', function (newValue) {
                if (newValue && newValue.length > -1) {
                    $scope.sortCache = {};
                    $scope.filtered = $scope._gridOptions.data.slice();
                    $scope.filters.forEach(function (filter) {
                        if (filter.filterType === 'select') {
                            $scope[filter.model + 'Options'] = generateOptions($scope.filtered, filter.filterBy);
                        }
                    });

                    if ($scope.urlSync) {
                        parseUrl();
                    } else {
                        applyFilters();
                    }
                }
            });

            $scope.sort = function (predicate, isDefaultSort) {
                if (!isDefaultSort) {
                    var direction = $scope.sortOptions.predicate === predicate && $scope.sortOptions.direction === 'desc' ? 'asc' : 'desc';
                    $scope.sortOptions.direction = direction;
                    $scope.sortOptions.predicate = predicate;
                }
                $scope.paginationOptions.currentPage = 1;
                $scope.reloadGrid(isDefaultSort);
            };

            $scope.filter = function () {
                $scope.paginationOptions.currentPage = 1;
                $scope.reloadGrid();
            };


            $scope.reloadGrid = function (isDefaultSort) {
                if ($scope.urlSync || $scope.serverPagination) {
                    changePath(isDefaultSort);
                } else {
                    applyFilters();
                }
                $rootScope.$broadcast('gridReloaded');
            };

            $scope._gridActions.refresh = $scope.reloadGrid;
            $scope._gridActions.filter = $scope.filter;
            $scope._gridActions.sort = $scope.sort;

    

            function changePath(isDefaultSort) {
                var path, needApplyFilters = false;

                path = 'page=' + $scope.paginationOptions.currentPage;
                if ($scope.paginationOptions.itemsPerPage !== $scope.defaultsPaginationOptions.itemsPerPage) {
                    path += '&itemsPerPage=' + $scope.paginationOptions.itemsPerPage;
                }

                if ($scope.sortOptions.predicate) {
                    path += '&sort=' + encodeURIComponent($scope.sortOptions.predicate + "-" + $scope.sortOptions.direction);
                }

                //custom filters
                $scope.filters.forEach(function (filter) {
                    var urlName = filter.model,
                        value = filter.isInScope ? $scope.$eval(urlName) : $scope.$parent.$eval(urlName);

                    if (filter.disableUrl) {
                        needApplyFilters = true;
                        return;
                    }

                    if (value) {
                        var strValue;
                        if (value instanceof Date) {
                            if (isNaN(value.getTime())) {
                                return;
                            }
                            strValue = value.getFullYear() + '-';
                            strValue += value.getMonth() < 9 ? '0' + (value.getMonth() + 1) + '-' : (value.getMonth() + 1) + '-';
                            strValue += value.getDate() < 10 ? '0' + value.getDate() : value.getDate();
                            value = strValue;
                        }
                        path += '&' + encodeURIComponent(urlName) + '=' + encodeURIComponent(value);
                    }
                });

                if (needApplyFilters) {
                    applyFilters();
                }
                $location.search(path);
                if (isDefaultSort) {
                    $scope.$apply();
                }
            }

            function parseUrl() {
                var params = $location.search(),
                    customParams = {};

                Object.keys(params).forEach(function(key) {
                    if (key !== 'page' && key !== 'sort' && key !== 'itemsPerPage') {
                        customParams[key] = params[key];
                    }
                });

                //custom filters
                $scope.filters.forEach(function (filter) {
                    var urlName = filter.model,
                        value = customParams[urlName];

                    if (filter.disableUrl) {
                        return;
                    }

                    //datepicker-specific
                    if (~filter.filterType.toLowerCase().indexOf('date')) {
                        $scope.$parent.__evaltmp = value ? new Date(value) : null;
                        $scope.$parent.$eval(urlName + '=__evaltmp');
                        return;
                    }


                    if (filter.filterType === 'select' && !value) {
                        value = '';
                    }

                    if (value) {
                        if (filter.isInScope) {
                            $scope.__evaltmp = value;
                            $scope.$eval(urlName + '=__evaltmp');
                        } else {
                            $scope.$parent.__evaltmp = value;
                            $scope.$parent.$eval(urlName + '=__evaltmp');
                        }
                    }
                });

                //pagination options
                $scope.paginationOptions.itemsPerPage = $scope.defaultsPaginationOptions.itemsPerPage;
                $scope.paginationOptions.currentPage = $scope.defaultsPaginationOptions.currentPage;

                if (params.itemsPerPage) {
                    $scope.paginationOptions.itemsPerPage = params.itemsPerPage;
                }

                if (params.page) {
                    if (!$scope.serverPagination && ((params.page - 1) * $scope.paginationOptions.itemsPerPage > $scope.filtered.length)) {
                        $scope.paginationOptions.currentPage = 1;
                    } else {
                        $scope.paginationOptions.currentPage = params.page;
                    }
                }

                //sort options
                if (params.sort) {
                    var sort = params.sort.split('-');
                    $scope.sortOptions.predicate = decodeURIComponent(sort[0]);
                    $scope.sortOptions.direction = decodeURIComponent(sort[1]);
                }
                if (!$scope.serverPagination) {
                    applyFilters();
                }
            }
            function applyFilters() {
                var time = Date.now(), sorted = false;

                //TO REMOVE ?
                $scope._time = {};

                if ($scope.sortOptions.predicate && $scope.sortCache && $scope.sortCache.predicate === $scope.sortOptions.predicate
                    && $scope.sortCache.direction === $scope.sortOptions.direction) {
                    $scope.filtered = $scope.sortCache.data.slice();
                    sorted = true;
                } else {
                    $scope.filtered = $scope._gridOptions.data.slice();
                }

                $scope._time.copy = Date.now() - time;
                var time2 = Date.now();
                applyCustomFilters();
                $scope._time.filters = Date.now() - time2;
                var time3 = Date.now();

                if ($scope.sortOptions.predicate && !sorted) {
                    $scope.filtered = $filter('orderBy')($scope.filtered, $scope.sortOptions.predicate, $scope.sortOptions.direction === 'desc');
                    $scope.sortCache = {
                        data: $scope.filtered.slice(),
                        predicate: $scope.sortOptions.predicate,
                        direction: $scope.sortOptions.direction
                    }
                }
                $scope._time.sort = Date.now() - time3;
                $scope._time.all = Date.now() - time;
                $scope.paginationOptions.totalItems = $scope.filtered.length;
            }

            function applyCustomFilters() {
                $scope.filters.forEach(function (filter) {
                    var predicate = filter.filterBy,
                        urlName = filter.model,
                        value = filter.isInScope ? $scope.$eval(urlName) : $scope.$parent.$eval(urlName),
                        type = filter.filterType;
                    if ($scope.customFilters[urlName]) {
                        $scope.filtered = $scope.customFilters[urlName]($scope.filtered, value, predicate);
                    } else if (value && type) {
                        var filterFunc = filtersFactory.getFilterByType(type);
                        if (filterFunc) {
                            $scope.filtered = filterFunc($scope.filtered, value, predicate);
                        }
                    }
                });
            }



        function generateOptions(values, predicate) {
          var array = [];
          if (values) {
              values.forEach(function (item) {
                  if (!~array.indexOf(item[predicate])) {
                      array.push(item[predicate]);
                  }
              });
  
              return array.map(function (option) {
                  return {text: option, value: option};
              });
          }
      }



























// HERE

self.toggleView = function(ary, data, index){
  for(var i=0; i<ary.length; i++){
    if(i!=index) { ary[i].expanded=false; }
    else { data.expanded=!data.expanded; }
  }
}


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
        $scope.gridOptions.data = response.data;
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