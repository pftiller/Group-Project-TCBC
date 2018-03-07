myApp.controller('MyProfileController', ['UserService', function(UserService) {
    console.log('MyProfileController created');
    let self = this;
    self.userService = UserService;
    self.userObject = UserService.userObject;
    self.viewProfile = UserService.viewProfile;

    self.viewProfile = function() {
      self.UserService.viewProfile();
    }
  }]);
  

  