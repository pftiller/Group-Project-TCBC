myApp.controller('MyProfileController', ['UserService', function(UserService) {
    console.log('MyProfileController created');
    var self = this;
    self.userService = UserService;
    self.userObject = UserService.userObject;
  }]);
  

  