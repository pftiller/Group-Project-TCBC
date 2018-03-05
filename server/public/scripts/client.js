var myApp = angular.module('myApp', ['ngRoute', 'ngMaterial']);

/// Routes ///
myApp.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
  console.log('myApp -- config')
  $routeProvider
    .when('/my-rides', {
      templateUrl: '/views/user/templates/member.myRides.html',
      controller: 'MemberMyRidesController as vm',
      resolve: {
        getuser: function (UserService) {
          return UserService.getuser();
        }
      }
    })
    .when('/ride-leader/my-rides', {
      templateUrl: '/views/ride-leader/templates/rideLeader.myRides.html',
      controller: 'RideLeaderController as vm',
      resolve: {
        getuser: function (UserService) {
          return UserService.getuser();
        }
      }
    })
    .when('/profile/my-profile.html', {
      templateUrl: '/views/profile/my-profile.html',
      controller: 'MyProfileController as vm',
      resolve: {
        getuser: function (UserService) {
          return UserService.getuser();
        }
      }
    })
    .when('/register', {
      templateUrl: '/views/user/templates/register.html',
      controller: 'LoginController as vm'
    })
    .when('/', {
      redirectTo: 'home'
    })
    .when('/home', {
      templateUrl: '/views/shared/home.html',
      controller: 'HomeController as vm',
    })
    .when('/user', {
      templateUrl: '/views/user/templates/user.html',
      controller: 'UserController as vm',
      resolve: {
        getuser: function (UserService) {
          return UserService.getuser();
        }
      }
    })
    .when('/info', {
      templateUrl: '/views/user/templates/info.html',
      controller: 'InfoController as vm',
      resolve: {
        getuser: function (UserService) {
          return UserService.getuser();
        }
      }
    })
    
    .when('/login', {
      templateUrl: '/views/shared/login.html',
      controller: 'LoginController as vm',
    })
    .otherwise({
      template: '<h1>404</h1>'
    })


}]);