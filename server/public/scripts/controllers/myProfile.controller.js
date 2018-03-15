myApp.controller('MyProfileController', ['MyProfileService', '$location','$mdDialog', function (MyProfileService, $location, $mdDialog) {
    // console.log('MyProfileController created');
    let self = this;
    self.viewProfile = {};

    self.viewProfile = function(){
      MyProfileService.viewProfile().then((res)=>{
        // console.log('back from database', res);
        self.viewProfile = res[0];
      })
    }
    self.viewProfile();
    self.statsView = function(){
      $location.path('/stats')
    }
    self.close = function(){
      $mdDialog.cancel();
    }
  }]);