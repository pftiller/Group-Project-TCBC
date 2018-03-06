myApp.controller('NavController', ['UserService', function(UserService) {
    console.log('NavController created');
    var self = this;
    self.userService = UserService;
    self.userObject = UserService.userObject;

  }]);