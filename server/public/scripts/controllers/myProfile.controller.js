myApp.controller('MyProfileController', ['MyProfileService', '$location','$mdDialog', function (MyProfileService, $location, $mdDialog) {
<<<<<<< HEAD
    //    ('MyProfileController created');
=======
>>>>>>> 6307b5aec85ae800210ad8cbe29886bbfd896648
    let self = this;
    self.viewProfile = {};

    self.viewProfile = function(){
      MyProfileService.viewProfile().then((res)=>{
<<<<<<< HEAD
        //    ('back from database', res);
=======
>>>>>>> 6307b5aec85ae800210ad8cbe29886bbfd896648
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