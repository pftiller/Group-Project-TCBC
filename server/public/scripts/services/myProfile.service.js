myApp.service('myProfileService', ['$http', '$location', function($http, $location){
    console.log('myProfileService Loaded');
    let self = this;
    self.viewProfile = {
        list: {}
    };
  
    self.viewProfile = function(userData) {
        self.viewProfile.userData = userData;
    }
    
  
  }]);
  