myApp.controller('LoginController', ['$http', '$location', 'UserService', '$mdDialog', function ($http, $location, UserService, $mdDialog) {
  console.log('LoginController created');
  var self = this;
  self.showNav = UserService.showNav;
  self.user = {
    member_id: '',
    password: ''
  };
  self.message = '';
  self.user = UserService.userObject;

    
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
                  $location.path('/home');
                })
              
              $mdDialog.hide();
              self.showNav = true;
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


}]);

/* Not in use for now */
// self.registerUser = function () {
//   if (self.user.member_id === '' || self.user.password === '') {
//     self.message = "Choose a username and password!";
//   } else {
//     console.log('sending to server...', self.user);
//     $http.post('/api/user/register', self.user).then(function (response) {
//       console.log('success');
//       $location.path('/user');
//     },
//       function (response) {
//         console.log('error');
//         self.message = "Something went wrong. Please try again."
//       });
//   }
// }