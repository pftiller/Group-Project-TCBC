myApp.controller('NavController', ['UserService', '$mdDialog', '$route', '$mdMenu', function(UserService, $mdDialog, $route, $mdMenu) {
       ('NavController created');
    var self = this;
    self.userService = UserService;
    self.userObject = UserService.userObject;
    self.toggle = true;
    self.openMenu = function($mdMenu, ev) {
      originatorEv = ev;
      $mdMenu.open(ev);
    };
    self.activetab = $route.current.$$route.activetab;
       ('$route ', $route.current.$$route.activetab);
    self.currentNavItem = UserService.currentNavItem;
       ('current nav', self.currentNavItem);

  }]);