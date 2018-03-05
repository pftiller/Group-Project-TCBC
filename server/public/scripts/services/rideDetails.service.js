myApp.service('RideDetailService', ['$http', '$location', function($http, $location){
    console.log('RideDetailService Loaded');
    let self = this;

    self.rides = {
        list: [
            ride1 = {name: 'Ride Name', date: 'Ride Date/Time', category: 'Ride Category', description: 'Description poijoisgoisgoisgoisjdgjojg',
            leader: 'Ride Leader', distancePicked: 'Distance picked', actualDistance: 'Distance Ridden', gps: 'Gps Link'},
            ride2 = {name: 'Ride2 Name', date: 'Ride2 Date/Time', category: 'Ride2 Category', description: 'Description2 poijoisgoisgoisgoisjdgjojg',
            leader: 'Ride2 Leader', distancePicked: 'Distance2 picked', actualDistance: 'Distance2 Ridden', gps: 'Gps Link2'}
        ]
        };
        
  }]);
  