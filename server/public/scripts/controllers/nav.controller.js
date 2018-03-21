myApp.controller('NavController', ['UserService', '$mdDialog', '$route', '$mdMenu', function(UserService, $mdDialog, $route, $mdMenu) {
<<<<<<< HEAD
       ('NavController created');
=======
>>>>>>> 6307b5aec85ae800210ad8cbe29886bbfd896648
    var self = this;
    self.userService = UserService;
    self.userObject = UserService.userObject;
    self.toggle = true;
    self.openMenu = function($mdMenu, ev) {
      originatorEv = ev;
      $mdMenu.open(ev);
    };
    //Getting the current open page to be displayed as active
    self.activetab = $route.current.$$route.activetab;
<<<<<<< HEAD
       ('$route ', $route.current.$$route.activetab);
    self.currentNavItem = UserService.currentNavItem;
       ('current nav', self.currentNavItem);

=======
    self.currentNavItem = UserService.currentNavItem;
>>>>>>> 6307b5aec85ae800210ad8cbe29886bbfd896648
  }]);