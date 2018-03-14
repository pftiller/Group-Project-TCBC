const moment = require('moment');

function sortDataForCharts(array){
    console.log('array in module: ', array);
    let lineChartData = {};
    lineChartData.datesArray = [];
    lineChartData.mileageArray = [];

    for(let i = 0; i<array.length;i++){

        
        let date = moment(array[i].date).format('MMM Do YYYY');
        lineChartData.datesArray.push(date);
        lineChartData.mileageArray.push(array[i].distance_biked);
    }


    return lineChartData;
}


module.exports = sortDataForCharts;