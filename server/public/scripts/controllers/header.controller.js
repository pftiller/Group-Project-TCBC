myApp.controller('HeaderController', ['UserService', '$mdDialog', function(UserService, $mdDialog) {
    console.log('HeaderController created');
    var self = this;
    self.userService = UserService;
    self.userObject = UserService.userObject;


    self.loginModal = function() {
      $mdDialog.show({
          controller: LoginController,
          controllerAs: 'vm',
          templateUrl: '../views/shared/login.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: true,

      })

  }

  }]);