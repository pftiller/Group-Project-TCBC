myApp.controller('myProfileController', ['UserService', function(UserService) {
    console.log('myProfileController created');
    var self = this;
    self.userService = UserService;
    self.userObject = UserService.userObject;
  }]);
  

  