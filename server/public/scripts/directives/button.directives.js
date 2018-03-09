myApp.directive('detailsBtn', function () {
    return {
      template: '<md-button class="md-raised md-primary">Details</md-button>',
      controller: "HomeController as vm"
    };
  });
