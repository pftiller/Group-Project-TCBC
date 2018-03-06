myApp.controller('NavController', ['UserService', '$mdDialog', function(UserService, $mdDialog) {
    console.log('NavController created');
    var self = this;
    self.userService = UserService;
    self.userObject = UserService.userObject;
    self.toggle = true;
    self.openMenu = function($mdMenu, ev) {
      originatorEv = ev;
      $mdMenu.open(ev);
    };

  }]);