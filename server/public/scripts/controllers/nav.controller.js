myApp.controller('NavController', ['UserService', '$mdDialog', '$location', '$scope', '$log', function(UserService, $mdDialog, $location, $scope, $log) {
    console.log('NavController created');
    var self = this;
    self.userService = UserService;
    self.userObject = UserService.userObject;
    self.toggle = true;
    self.openMenu = function($mdMenu, ev) {
      originatorEv = ev;
      $mdMenu.open(ev);
    };
    self.selectedIndex = UserService.selectedIndex;

    // self.selectedIndex = 0;

    // self.$watch('selectedIndex', function(current, old) {
    //   switch (current) {
    //     case 0:
    //       $location.url("/home");
    //       break;
    //     case 1:
    //       $location.url("/my-rides");
    //       break;
    //     case 2:
    //       $location.url("/my-profile");
    //       break;
    //   }
    // });

    // self.$on('$routeChangeSuccess', function(evt, current, previous) {
    //   if (previous == undefined) {
    //     $log.debug('Observed route change success', current);
    //     $log.debug('Direct tab index', current.locals.tabIndex);
    //     self.selectedIndex = current.locals.tabIndex;
    //   }
    // });

    self.state =$location.path();
    self.go=function(path){
      $location.path(path);
    };
      

    var pId = $location.path()

    var init = function() {
      console.log('this is the path', pId);
    }

    init();
  }]);
