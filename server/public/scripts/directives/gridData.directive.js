myApp.directive('gridData', ['$compile', '$animate', function ($compile) {
    return {
        restrict: 'EA',
        //transclude: true,
        //replace: true,
        scope: true,
        controller: 'gridController',
        link: function ($scope, $element, attrs) {
            var filters = [],
                directiveElement = $element.parent(),
                gridId = attrs.id,
                serverPagination = attrs.serverPagination === 'true';
            $scope.serverPagination = serverPagination;


            angular.forEach(angular.element(directiveElement[0].querySelectorAll('[sortable]')), function (sortable) {
                var element = angular.element(sortable),
                    predicate = element.attr('sortable');
                element.attr('ng-class', "{'sort-ascent' : sortOptions.predicate ==='" +
                    predicate + "' && sortOptions.direction === 'asc', 'sort-descent' : sortOptions.predicate === '" +
                    predicate + "' && sortOptions.direction === 'desc'}");
                element.attr('ng-click', "sort('" + predicate + "')");
                $compile(element)($scope);
            });
            angular.forEach(document.querySelectorAll('[filter-by]'), function (filter) {
                var element = angular.element(filter),
                    predicate = element.attr('filter-by'),
                    dataGridElement = document.querySelectorAll('[grid-data]')[0],
                    isInScope = dataGridElement.querySelectorAll('[filter-by="'+ predicate+'"]').length > 0,
                    filterType = element.attr('filter-type') || '',
                    urlName = element.attr('ng-model'),
                    disableUrl = element.attr('disable-url');

                if (gridId && element.attr('grid-id') && gridId != element.attr('grid-id')) {
                    return;
                }

                if (filterType !== 'select') {
                } else {
                    $scope[urlName + 'Options'] = generateOptions($scope.$eval($element.attr('grid-options') + '.data'), predicate);
                }

                if (~filterType.indexOf('date') && !element.attr('ng-focus')
                    && !element.attr('ng-blur')) {
                    element.attr('ng-focus', "filter('{" + urlName + " : " + "this." + urlName + "}')");
                    element.attr('ng-blur', "filter('{" + urlName + " : " + "this." + urlName + "}')");
                    //$compile(element)($scope);
                }
                if (!urlName) {
                    urlName = predicate;
                    element.attr('ng-model', predicate);
                    element.attr('ng-change', 'filter()');
                    //$compile(element)($scope);
                }
                //$compile(element)($scope);
                filters.push({
                    model: urlName,
                    isInScope: isInScope,
                    filterBy: predicate,
                    filterType: filterType,
                    disableUrl: disableUrl
                });
            });

            $scope.filters = filters;
        }
    }
}])

