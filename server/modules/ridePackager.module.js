
class RideDistances {
    constructor(ride_id,ride_distance){
        this.ride_id = ride_id;
        this.ride_distance = ride_distance;
    }
}

function storeRideDistancesAsProperty(rides){
    for(let i=0; i<rides.length;i++){
        //console.log('ride inside For Loop: ', rides[i]);
    
        //console.log(rides[i].ride_distance);
        //console.log(rides[i].ride_distance_id);
       //console.log('back from combine: ', combineRideAndId(rides[i].ride_distance_id,rides[i].ride_distance) );
        rides[i].distanceSelction = combineRideAndId(rides[i].ride_distance_id,rides[i].ride_distance);
    }
    return rides;  
}

function combineRideAndId(idArray,distanceArray){
    let distancesArray =[];
    for(let i =0; i<idArray.length; i++){
        distancesArray.push(new RideDistances(idArray[i],distanceArray[i]));
    }
    return distancesArray;
}


module.exports = storeRideDistancesAsProperty;