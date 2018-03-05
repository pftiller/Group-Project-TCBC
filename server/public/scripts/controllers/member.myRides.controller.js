myApp.controller('MemberMyRidesController', ['RideDetailService', '$mdDialog', function(RideDetailService, $mdDialog) {
    console.log('MemberMyRidesController created');
    let self = this;

    self.rideDetailReveal = function(ride){
        console.log('BUTTON DETAILS CLICKED', ride);
        self.loadWelcomeModal(ride);
    }
    self.rides = RideDetailService.rides;

    self.loadWelcomeModal = function (ride, ev) {
        $mdDialog.show({
            controller: RideDetailController,
            controllerAs: 'vm',
            templateUrl: '../views/partials/ride-detail-modal.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            resolve: {
                item: function () {
                    return ride;
                }
            }
        })

    }

    function RideDetailController($mdDialog, item , RideDetailService) {
        const self = this;
        self.rides = RideDetailService.rides;
        self.ride = item;
        self.user = {
            loggedIn: false
        };
        self.hide = function () {
            $mdDialog.hide();
        };

        self.cancel = function () {
            $mdDialog.cancel();
        };

        self.success = function (answer) {
            // console.log('answer', answer);
            swal(answer, '', {
                className: "success-alert",
            });
            // $mdDialog.hide(answer);
        };
        self.error = function (answer) {
            // console.log('answer', answer);
            swal(answer, '', 'error', {
                className: "error-alert",
            });
            // $mdDialog.hide(answer);
        };
    }

  }]);
  

