myApp.filter('dateFilter', function() {
    return function(items, filteryDate) {
        var retArray = [];
        
        if (!filteryDate) {
            console.log('no filter');
            return items;
        }
        let newDate= moment(filteryDate).format('MM/DD/YYYY');
        angular.forEach(items, function(obj) {
            var rideDate = obj.date;
            console.log(rideDate);
           
            if (rideDate === newDate) {
                retArray.push(obj);
                console.log(retArray);
            }
        });

        return retArray;
        // console.log('FILTER!!!');

    }
})