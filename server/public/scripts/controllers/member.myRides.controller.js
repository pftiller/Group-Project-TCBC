myApp.controller('MemberMyRidesController', ['UserService', function(UserService) {
    console.log('MemberMyRidesController created');
    let self = this;
    self.userService = UserService;
    self.userObject = UserService.userObject;
  }]);
  

