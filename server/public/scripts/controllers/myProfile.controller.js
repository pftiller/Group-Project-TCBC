myApp.controller('MyProfileController', ['MyProfileService', function (MyProfileService) {
    console.log('MyProfileController created');
    let self = this;
    self.viewProfile = {};

    self.viewProfile = function(){
      MyProfileService.viewProfile().then((res)=>{
        console.log('back from database with the stuff', res);
        self.viewProfile = res[0];
      })
    }
    self.viewProfile();
  }]);
  

  