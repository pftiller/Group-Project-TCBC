myApp.factory('filtersFactory', function () {
    function selectFilter(items, value, predicate) {
        return items.filter(function (item) {
            return value && item[predicate] ? item[predicate] === value : true;
        });
    }

    function textFilter(items, value, predicate) {
        return items.filter(function (item) {
            return value && item[predicate] ? ~(item[predicate] + '').toLowerCase().indexOf((value + '').toLowerCase()) : !!item[predicate];
        });
    }

    function dateFilter(items, value, predicate) {
        value = new Date(value).getTime();
        return items.filter(function (item) {
            return value && item[predicate] ? item[predicate] >= value : true;
        });
    }

    return {
        getFilterByType: function (type) {
            switch (type) {
                case 'select' :
                {
                    return selectFilter;
                }
                case 'text' :
                {
                    return textFilter;
                }
                case 'date':
                {
                    return dateFilter;
                }
                default :
                {
                    return null;
                }
            }
        }
    }
});