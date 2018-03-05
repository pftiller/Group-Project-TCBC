myApp.controller('HeaderController', ['UserService', function(UserService) {
    console.log('HeaderController created');
    var self = this;
    self.userService = UserService;
    self.userObject = UserService.userObject;
  }]);