myApp.controller('MemberMyRidesController', ['UserService', function(UserService) {
    console.log('MemberMyRidesController created');
    let self = this;
    self.userService = UserService;
    self.userObject = UserService.userObject;

    self.rides = {
    list: [
        ride1 = {name: 'Ride Name', date: 'Ride Date/Time', category: 'Ride Category', description: 'Description poijoisgoisgoisgoisjdgjojg',
        leader: 'Ride Leader', distance: 'Distance', gps: 'Gps Link'}
    ]
    };

    // self.rides = RideService.rides;
    
  }]);
  

