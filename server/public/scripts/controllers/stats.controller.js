myApp.controller('MyStatsController', ['MyProfileService', '$location','$http','RideDetailService', function (MyProfileService, $location, $http, RideDetailService) {
    // console.log('MyProfileController created');
    let self = this;
    self.viewProfile = {};
    self.goal = {};
    self.totalMiles = {};

    self.viewProfile = function () {
        MyProfileService.viewProfile().then((res) => {
            // console.log('back from database', res);
            self.viewProfile = res[0];
        })
    }
    self.viewProfile();
    self.statsView = function (){
        $location.path('/stats')
    }

    self.getGoalData = function(){
        $http.get('/member/stats/goal')
            .then((response)=>{
                self.goal.currentGoal = response.data[0].goal;
                RideDetailService.getMileageForMember()
                    .then((res)=>{
                        console.log('response on mileage: ', res);
                        self.totalMiles = res.sum;
                    goalProgress.refresh(self.totalMiles,response.data[0].goal);
                        
                    })
                
            })
            .catch((err)=>{
                console.log('error getting stats: ', err);   
            })

    }
    self.getGoalData();

    self.setGoal = function(newGoal){
        console.log('new Goal: ', newGoal);
        $http.put('/member/stats/goal', newGoal)
            .then((response)=>{
                console.log('response on goal POST: ', response);
                self.getGoalData();
                swal('Goal Updated!','', 'success')
                self.goal.setGoal = '';
            })
            .catch((err)=>{
                console.log('error with goal post: ', err);
                
            })
    }

    /* Goal Trakcer Dial */
    var goalProgress = new JustGage({
        id: "bigfella",
        value: 0,
        min: 0,
        max: 100,
        label: "Miles Towards Goal",
        titlePosition: 'below',
        pointer: true,
        gaugeWidthScale: .2,
        relativeGaugeSize: true,
        levelColors: [
            "#ff0000",
            "#ffff66",
            "#ccff99",
            "#33cc33"
        ] 
      });
      trackDateArrayLength = [];
      trackDateArrayLength = trackDateArrayLength.length;
    
    /* Line Graph */
    var ctx = document.getElementById('lineChart').getContext('2d');
    var chart = new Chart(ctx, {
    // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: [],
            datasets: [{
                label: "Miles Biked Per Ride",
                backgroundColor: false,
                borderColor: 'rgb(255, 99, 132)',
                data: [],
                fill: false
            }]
        },

        // Configuration options go here
        options: {}
    });

    
    self.getLineChartData = function(){
        $http.get('/rides/stats')
            .then((response)=>{
                console.log('response on getting linechart data: ', response.data);
                
                chart.chart.config.data.labels = response.data.datesArray;
                chart.chart.config.data.datasets[0].data = response.data.mileageArray;
                
                chart.update();
                console.log('chart!: ', chart.chart.config);
                
            })
            .catch((err)=>{
                console.log('failed to get linechart data: ', err);
                
            })
    }
    self.getLineChartData();
    
    function formatDates(array){
        let formattedArray = [];
        for(let i=0;i<array.length;i++){
            let date = moment('MMMM Do YYYY').format(array[i])
            formattedArray.push(date);
        }
        return formattedArray;
    }

}]);