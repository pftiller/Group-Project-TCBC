myApp.service('UserService', ['$http', '$location', function($http, $location){
  console.log('UserService Loaded');
  var self = this;
  self.userObject = {};

  self.getuser = function(){
    console.log('UserService -- getuser');
    return $http.get('/api/user').then(function(response) {
        if(response.data.member_id) {
            // user has a curret session on the server
            console.log('user service: ', response.data);
            self.userObject.member_id = response.data.member_id;
            console.log('UserService -- getuser -- User Data: ', self.userObject.member_id);
        } else {
            console.log('UserService -- getuser -- failure');
            // user has no session, bounce them back to the login page
            $location.path("/login");
        }
    },function(response){
      console.log('UserService -- getuser -- failure: ', response);
      $location.path("/login");
    });
  }

  self.login = function(user){
    return  $http.post('/api/user/login', user).then(
        function (response) {
          if (response.status == 200) {
            console.log('success: on login ', response.data);

            // location works with SPA (ng-route)g
            $location.path('/home');
          } else {
            console.log('failure error: ', response);
            self.message = "Incorrect credentials. Please try again.";
          }
        },
        function (response) {
          console.log('failure error: ', response);
          self.message = "Incorrect credentials. Please try again.";
        });
  }


  self.logout = function() {
    console.log('UserService -- logout');
    $http.get('/api/user/logout').then(function(response) {
      console.log('UserService -- logout -- logged out');
      $location.path("/home");
    });
  }
        
  



}]);
