myApp.controller('LoginController', ['$http', '$location', 'UserService', function ($http, $location, UserService) {
      console.log('LoginController created');
      var self = this;
      self.user = {
        member_id: '',
        password: ''
      };
      self.message = '';

    self.login = function () {
      if (self.user.member_id === '' || self.user.password === '') {
        self.message = "Enter your username and password!";
      } else {
        console.log('sending to server...', self.user);
        UserService.login(self.user);
        
      }
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


      }]);