myApp.service('UserService', ['$http', '$location', function ($http, $location) {
  console.log('UserService Loaded');
  var self = this;
  self.userObject = {};

  self.getuser = function () {
    console.log('UserService -- getuser');
    return $http.get('/api/user').then(function (response) {
      if (response.data.member_id) {
        // user has a curret session on the server
        console.log('user service: ', response.data);
        self.userObject.member_id = response.data.member_id;
        self.userObject.first_name = response.data.first_name;
        self.userObject.role = response.data.role;
        self.userObject.user_id = response.data.id
        return self.userObject;
      } else {
        console.log('UserService -- getuser -- failure');
        // user has no session, bounce them back to the login page
        $location.path("/landing");
      }
    }, function (response) {
      console.log('UserService -- getuser -- failure: ', response);
      $location.path("/landing");
    });
  }

  self.login = function (user) {
    return $http.post('/api/user/login', user).then(
      function (response) {
        if (response.status == 200) {
          self.userObject.member_id = response.data.member_id;
          self.userObject.first_name = response.data.first_name;
          self.userObject.role = response.data.role;
          return response;

        } else {
          self.message = "Incorrect credentials. Please try again.";


        }
      },
      function (response) {
        return response;
        self.message = "Incorrect credentials. Please try again.";
      });
  }


  self.logout = function () {
    console.log('UserService -- logout');
    return $http.get('/api/user/logout')
      .then(function (response) {
        console.log('UserService -- logout -- logged out');
        self.userObject = {};
      });
  }





}]);