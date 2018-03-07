myApp.controller('MyProfileController', ['MyProfileService', function(MyProfileService) {
    console.log('MyProfileController created');
    let self = this;
    self.userObject = UserService.userObject;
    self.viewProfile = {};

    self.viewProfile = function(){
      UserService.viewProfile().then((res)=>{
        console.log('back from database with the stuff', res);
      })
    }
    self.viewProfile();
  }]);
  

  