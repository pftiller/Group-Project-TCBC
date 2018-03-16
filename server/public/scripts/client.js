var myApp = angular.module('myApp', ['ngRoute', 'ngMaterial', 'ngMessages', 'ngFileUpload', 'dataGrid', 'pagination', 'wt.responsive']);

/// Routes ///
myApp.config(['$routeProvider', '$locationProvider', '$mdThemingProvider', function ($routeProvider, $locationProvider, $mdThemingProvider) {
  console.log('myApp -- config');
  $routeProvider
    .when('/', {
      redirectTo: '/landing'
    })
    .when('/landing', {
      templateUrl: '/views/landing/landing.html',
      controller: 'HomeController as vm'

    })
    .when('/home', {
      templateUrl: '/views/shared/home.html',
      controller: 'HomeController as vm',
      resolve: {
        getuser: function (UserService) {
          return UserService.getuser();
        },
        tabIndex: function() {
          return 0;
        }
      }
    })
    .when('/login', {
      templateUrl: '/views/shared/login.html',
      controller: 'LoginController as vm',
    })
    .when('/my-rides', {
      templateUrl: '/views/user/templates/member.myRides.html',
      controller: 'MemberMyRidesController as vm',
      resolve: {
        getuser: function (UserService) {
          return UserService.getuser();
        },
        tabIndex: function() {
          return 1;
        }
      }
    })
    .when('/check-in/:rideId', {
      templateUrl: '/views/ride-leader/templates/check-in-view.html',
      controller: 'CheckInController as vm',
      resolve: {
        getuser: function (UserService) {
          return UserService.getuser();
        },
        tabIndex: function() {
          return 0;
        }
      }
    })
    .when('/ride-leader/my-rides', {
      templateUrl: '/views/ride-leader/templates/rideLeader.myRides.html',
      controller: 'RideLeaderController as vm',
      resolve: {
        getuser: function (UserService) {
          return UserService.getuser();
        },
        tabIndex: function() {
          return 1;
        }
      }
    })
    .when('/my-profile', {
      templateUrl: '/views/profile/templates/my-profile.html',
      controller: 'MyProfileController as vm',
      activetab: 'my-profile',
      resolve: {
        getuser: function (UserService) {
          return UserService.getuser();
        },
        tabIndex: function() {
          return 2;
        }
      }
    })
    .when('/stats', {
      templateUrl: '/views/shared/my-stats.html',
      controller: 'MyStatsController as vm',
      resolve: {
        getuser: function (UserService) {
          return UserService.getuser();
        },
        tabIndex: function() {
          return 2;
        }
      }
    })
    .when('/manage-members', {
      templateUrl: '/views/admin/templates/manage-members.html',
      controller: 'AdminController as vm',
      resolve: {
        getuser: function (UserService) {
          return UserService.getuser();
        },
        tabIndex: function() {
          return 3;
        }
      }
    })
    .when('/manage-rides', {
      templateUrl: '/views/admin/templates/manage-rides.html',
      controller: 'AdminController as vm',
      resolve: {
        getuser: function (UserService) {
          return UserService.getuser();
        },
        tabIndex: function() {
          return 3;
        }
      }
    })
    .when('/register', {
      templateUrl: '/views/shared/register.html',
      controller: 'LoginController as vm'
    })
    .when('/user', {
      templateUrl: '/views/user/templates/user.html',
      controller: 'UserController as vm',
      resolve: {
        getuser: function (UserService) {
          return UserService.getuser();
        },
        tabIndex: function() {
          return 0;
        }
      }
    })
    .when('/info', {
      templateUrl: '/views/user/templates/info.html',
      controller: 'InfoController as vm',
      resolve: {
        getuser: function (UserService) {
          return UserService.getuser();
        },
        tabIndex: function() {
          return 0;
        }
      }
    })
    .otherwise({
      template: '<h1>404</h1>'
    });
    $mdThemingProvider.definePalette('tcbc', {
      '50': 'ffffff',
      '100': 'bfe3f7',
      '200': '8dcdf1',
      '300': '4eb1e9',
      '400': '32a5e5',
      '500': '1c98dd',
      '600': '1985c2',
      '700': '1573a7',
      '800': '12608c',
      '900': '0e4d70',
      'A100': 'f9fdff',
      'A200': '93d8ff',
      'A400': '35b2f7',
      'A700': '28a5ea',
      'contrastDefaultColor': 'light',
      'contrastDarkColors': [
        '50',
        '100',
        '200',
        '300',
        '400',
        'A100',
        'A200',
        'A400',
        'A700'
      ],
      'contrastLightColors': [
        '500',
        '600',
        '700',
        '800',
        '900'
      ]
    });
    $mdThemingProvider.theme('tcbc')
    .primaryPalette('tcbc')

}]);
