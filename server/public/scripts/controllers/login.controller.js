myApp.controller('LoginController', ['$http', '$location', 'UserService', 'RideDetailService', '$mdDialog', function ($http, $location, UserService, RideDetailService, $mdDialog) {
  console.log('LoginController created');
  var self = this;
  self.showNav = UserService.showNav;
  self.user = {
    member_id: '',
    password: ''
  };
  self.message = '';
  self.user = UserService.userObject;

  self.myMileage = RideDetailService.myMileage;
    
    self.login = function () {
      if (self.user.member_id === '' || self.user.password === '') {
        self.message = "Enter your username and password!";
      }else{
        console.log('sending to server...', self.user);
        UserService.login(self.user).then(
          (response)=>{
            if(response.status == 401){
              self.message = "Incorrect Member ID or Password"
            }else if(response.status == 200){
                UserService.getuser().then((response)=>{
                  console.log('after login, user data: ', response);
                  self.user = response;
                  console.log('self.user after login: ', self.user);
                  
                  $location.path('/home');
                })
              $mdDialog.hide();
            }
          }
        );   
      }
    }
  self.logout = function () {
    UserService.logout()
      .then(()=>{
        $location.path('/landing')
      });
  }
  self.loginModal = function (ev) {
    $mdDialog.show({
      parent: angular.element(document.body),
      targetEvent: ev,
      templateUrl: '../views/shared/login.html',
      controller: 'LoginController',
      controllerAs: 'vm',
      clickOutsideToClose: true,
    });
  }

  self.cancel = function () {
    $mdDialog.cancel();
  }

  self.close = function (reason) {
    $mdDialog.hide();
  }

  RideDetailService.getMileageForMember();


  self.registerModal = function (ev) {
    $mdDialog.show({
      parent: angular.element(document.body),
      targetEvent: ev,
      templateUrl: '../views/shared/register.html',
      controller: RegisterController,
      controllerAs: 'vm',
      clickOutsideToClose: true,
    });
  }

  function RegisterController($mdDialog, UserService){
    const self = this;
    self.passwordMatch = {
      state: true
    };
    self.newUser = {
      member_id: '',
      password1: '',
      password2: '',
      password: ''
    }
    self.register = function(){
      if (self.newUser.password1 != self.newUser.password2) {
        self.passwordMatch.state = false;
      } else {
        // alert('register')
        self.newUser.password = self.newUser.password1;
        console.log('new user ', self.newUser);
        UserService.registerUser(self.newUser);
        self.passwordMatch.state = true;
        self.newUser = {
          member_id: '',
          password1: '',
          password2: '',
          password: ''
        }
        $location
      }
    }

    self.cancel = function () {
      $mdDialog.cancel();
    }
  
    self.close = function () {
      $mdDialog.hide();
    }
  }
}]);

