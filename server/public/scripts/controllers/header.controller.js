myApp.controller('HeaderController', ['UserService', '$mdDialog', '$location', function (UserService, $mdDialog, $location) {
    console.log('HeaderController created');
    var self = this;
    self.userService = UserService;
    self.userObject = UserService.userObject;

    self.loginModal = function() {
        UserService.loginModal();
      }
      

      
  
}]);