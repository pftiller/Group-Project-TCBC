myApp.service('UserService', ['$http', '$location', function ($http, $location) {
  var self = this;
  self.userObject = {};
  self.currentNavItem = {
    value: ""
  };

  self.getuser = function () {
    return $http.get('/api/user').then(function (response) {
      if (response.data.member_id) {
        // user has a curret session on the server
        self.userObject.member_id = response.data.member_id;
        self.userObject.first_name = response.data.first_name;
        self.userObject.role = response.data.role;
        self.userObject.user_id = response.data.id
        return self.userObject;
      } else {
        // user has no session, bounce them back to the landing page
        $location.path("/landing");
      }
    }, function (response) {
      $location.path("/landing");
    });
  }

  self.getRideLeader = function () {
    return $http.get('/api/user').then(function (response) {
      if (response.data.member_id) {
        // user has a curret session on the server
        self.userObject = response.data;
        if (response.data.role === 2 || response.data.role === 3) {
          return self.userObject
        } else {
          $location.path('/home');
        }
      } else {
        // user has no session, bounce them back to the landing page
        $location.path("/landing");
      }
    }, function (response) {
      $location.path("/landing");
    });

  }


  self.getRideAdmin = function () {
    return $http.get('/api/user').then(function (response) {
      if (response.data.member_id) {
        // user has a curret session on the server
        self.userObject = response.data;
        if (response.data.role === 3) {
          return self.userObject
        } else {
          $location.path('/home');
        }
      } else {
        // user has no session, bounce them back to the landing page
        $location.path("/landing");
      }
    }, function (response) {
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
    return $http.get('/api/user/logout')
      .then(function (response) {
        self.userObject = {};
      });
  }


  self.registerUser = function (newUser) {
    if (newUser.member_id === '' || newUser.password === '') {} else {
      return $http.post('/api/user/register', newUser).then(function (response) {
        if (response.status === 500) {
          swal('Error registering user, please try again later.', '', 'error');
        } else {
          console.log('response data ', response.data);
          return response.data
        }
      })
    }
  }


}]);