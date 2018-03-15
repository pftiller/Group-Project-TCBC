myApp.directive('gridItem', ['$compile', function ($compile) {
    return {
        restrict: 'EA',
        terminal:true,
        scope: false,
        link: function ($scope, element, attrs, ctrl, transclude) {
            if ($scope.serverPagination) {
                element.attr('ng-repeat', "item in filtered");
            } else {
                element.attr('ng-repeat', "item in filtered | startFrom:(paginationOptions.currentPage-1)*paginationOptions.itemsPerPage | limitTo:paginationOptions.itemsPerPage track by $index");
            }
            element.removeAttr('grid-item');
            var html = element[0].outerHTML;
            element.replaceWith($compile(html)($scope));
        }
    }
}])