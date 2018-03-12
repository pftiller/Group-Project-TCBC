const express = require('express');
const router = express.Router();
const isAuthenticated = require('../modules/isAuthenticated');
const pool = require('../modules/pool');
const ridePackager = require('../modules/ridePackager.module');



/* GET all Approved rides not authenticated*/
router.get('/public/details', (req, res) => {
    const allRidesQuery = `SELECT rides.id AS ride_id, array_agg(rides_distances.distance) AS ride_distance, array_agg(rides_distances.id) AS ride_distance_id, rides.rides_name,rides.rides_date,rides.description,rides.url,rides.ride_location, rides.ride_leader, rides.approved, rides.completed,rides. cancelled, rides.rides_category, users.first_name, users.last_name,users.phone_1,users.email, categories.type, categories.name
    FROM rides 
    JOIN rides_distances on rides.id = rides_distances.ride_id
    JOIN users on rides.ride_leader = users.id
    JOIN categories on rides.rides_category = categories.id
    WHERE approved = true
    GROUP BY rides.id, rides.rides_date, users.first_name, users.last_name, users.phone_1,users.email, categories.type, categories.name
    ORDER BY rides.rides_date`;
    pool.query(allRidesQuery)
        .then((result) => {
            let formattedRides = ridePackager(result.rows);
            res.send(formattedRides);
        })
        .catch((err) => {
            console.log('error getting all rides');
        })
});

/* GET all Non-Approved rides */
router.get('/admin/pendingApprovedRides', isAuthenticated, (req, res) => {
    const allRidesQuery = `SELECT rides.id AS ride_id, array_agg(rides_distances.distance) AS ride_distance, array_agg(rides_distances.id) AS ride_distance_id, rides.rides_name,rides.rides_date, rides.rides_category, rides.description,rides.url,rides.ride_location, rides.ride_leader,rides.approved,rides.completed,rides.cancelled, users.first_name, users.last_name,users.phone_1,users.email
    FROM rides 
    JOIN rides_distances on rides.id = rides_distances.ride_id
    JOIN users on rides.ride_leader = users.id
    WHERE approved = false
    GROUP BY rides.id, users.first_name, users.last_name, users.phone_1,users.email`;

    pool.query(allRidesQuery)
        .then((result) => {
            let formattedRides = ridePackager(result.rows);
            console.log('formatted rides: ', formattedRides);
            
            res.send(formattedRides);
        })
        .catch((err) => {
            console.log('error getting all rides');
        })
});
router.get('/member/rideDetails/complete/:rideId', isAuthenticated, (req, res) => {
    const allRidesQuery = `
    SELECT *
    FROM rides
    JOIN rides_users ON rides.id = rides_users.ride_id
    JOIN users ON users.id = rides_users.user_id
    JOIN rides_distances ON rides_users.selected_distance = rides_distances.id
    JOIN categories ON categories.id = rides.rides_category
    WHERE rides.id = $1
    AND rides_users.user_id = $2;`
    pool.query(allRidesQuery, [req.params.rideId, req.user.id])
        .then((result) => {
            console.log('rides ', result.rows);
            res.send(result.rows);
        })
        .catch((err) => {
            console.log('error getting all my rides', err);

        })
});
//get my rides only
//need to specify columns to get
router.get('/member/rideDetails', isAuthenticated, (req, res) => {
    const allRidesQuery = `SELECT * FROM rides
    JOIN rides_users on rides_users.ride_id = rides.id
    WHERE user_id = $1;`
    pool.query(allRidesQuery, [req.user.id])
        .then((result) => {
            console.log('rides ', result.rows);
            res.send(result.rows);
        })
        .catch((err) => {
            console.log('error getting all my rides', err);

        })
});


//get my mileage
router.get('/member/mileage', isAuthenticated, (req, res) => {
    const queryText = `
    SELECT SUM( actual_distance ) 
    FROM rides_users
    JOIN users ON rides_users.user_id = users.id
    WHERE rides_users.user_id = $1;`
    pool.query(queryText, [req.user.id])
        .then((result) => {
            console.log('user mileage ', result.rows);
            res.send(result.rows[0]);
        })
        .catch((err) => {
            console.log('error getting user mileage', err);
        })
});

// get riders for check in view
router.get(`/rideLeader/signedUpRiders/:rideId`, (req, res) => {
    const queryText = `
    SELECT * FROM users
    JOIN rides_users on rides_users.user_id = users.id
    WHERE rides_users.ride_id = $1;`
    pool.query(queryText, [req.params.rideId])
        .then((result) => {
            console.log('user infos ', result.rows);
            res.send(result.rows);
        })
        .catch((err) => {
            console.log('error getting users for ride check in', err);

        })

});



/* GET search for member */
router.get('/ride-leader/searchMembers/:first_name/:last_name/:member_id', isAuthenticated, (req, res) => {
    //res.send(categories);
    console.log('req.body for search ', req.body);
    console.log('req.params for search ', req.params); +
    req.params.member_id;
    console.log('req.params for search ', req.params.member_id);
    const queryText = `
    SELECT first_name, last_name, member_id, id 
    FROM users 
    WHERE member_id= $1
    OR first_name=$2
    OR last_name=$3;`
    pool.query(queryText, [req.params.member_id, req.params.first_name, req.params.last_name])
        .then((result) => {
            res.send(result.rows);
        })
        .catch((err) => {
            console.log('Error getting categories');
            res.sendStatus(500);
        })
});



/* GET All Categories */
router.get('/public/categories', (req, res) => {
    //res.send(categories);
    const CategoryQuery = `SELECT * FROM categories`;
    pool.query(CategoryQuery)
        .then((result) => {
            res.send(result.rows);
        })
        .catch((err) => {
            console.log('Error getting categories');
            res.sendStatus(500);
        })
});

//ride post to sign up
//add validation if user has already signed up?
//primary key was finickey
router.post('/signUp', isAuthenticated, (req, res) => {
    console.log('user ', req.user);
    console.log('req.body ', req.body);
    const query = `
    INSERT INTO rides_users (ride_id, user_id, selected_distance) 
    VALUES ($1, $2, $3)`;
    pool.query(query, [req.body.ride_id, req.user.id, req.body.selected_distance])
        .then((result) => {
            res.sendStatus(201);
        })
        // error handling
        .catch((err) => {
            console.log('error making insert query:', err);
            res.sendStatus(500);
        });
});



router.post('/ride-leader/sign-up-member', isAuthenticated, (req, res) => {
        console.log('req.body ', req.body);
        let ride = req.body.current;
        let member = req.body.member;
        const query = `
        INSERT INTO rides_users (ride_id, user_id, selected_distance) 
        VALUES ($1, $2, $3)`;
        pool.query(query, [ride.ride_id, member.id, ride.ride_distance_id[0]])
            .then((result) => {
                res.sendStatus(201);
            })
            // error handling
            .catch((err) => {
                console.log('error making insert query:', err);
                res.sendStatus(500);
            });
    });

// unregsiter member for ride
//delete rides_users row where userid and ride id are equal
router.delete('/unregister/:ride_id/', isAuthenticated, (req, res) => {
    console.log('user ', req.user);
    console.log('ride_id ', req.params.ride_id);
    const queryText = `
    DELETE FROM rides_users
    WHERE ride_id = $1
    AND user_id = $2`;
    pool.query(queryText, [req.params.ride_id, req.user.id])
        .then((result) => {
            console.log('delete rides_users ', result);
            res.sendStatus(201);
        })
        // error handling
        .catch((err) => {
            console.log('error making update completed query:', err);
            res.sendStatus(500);
        });
});

/* RideLeader Submit Ride for Approval */

router.post('/rideLeader/submitRide', isAuthenticated, (req, res) => {
    // console.log('user ', req.user);
    console.log('req.body ', req.body);
    console.log('distances: ', req.body.distances);
   
    const saveRideQuery = `
    INSERT INTO rides (rides_name, rides_category, rides_date, description, ride_leader, url, ride_location) 
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id;`;
    pool.query(saveRideQuery, [req.body.rides_name, req.body.rides_category, req.body.rides_date, req.body.description, req.user.id, req.body.url, req.body.ride_location])
        .then((result) => {
            // console.log('resulting post id', result.rows);
            console.log('Ride Insert Complete back with ID', result.rows[0].id);
            let ride_id = result.rows[0].id;
            const saveDistancesQuery = `
            INSERT INTO rides_distances (ride_id, distance) 
            VALUES($1, unnest($2::int[]))
            RETURNING id, distance;`
            pool.query(saveDistancesQuery, [ride_id, req.body.distances])
                .then((result) => {
                    console.log('Distances saved against ride Id: ', ride_id);
                    res.sendStatus(201);
                })
                .catch((err) => {
                    console.log('error making insert rides_distances query:', err);
                    res.sendStatus(500);
                });
        })
        // error handling
        .catch((err) => {
            console.log('error making insert rides query:', err);
            res.sendStatus(500);
      });

});





router.put('/admin/approveAndSave', isAuthenticated, (req,res)=>{

    console.log('EDIT RIDE BODY ', req.body);
    
    const ride_id = req.body.ride_id;
    console.log('ride ID is: ', ride_id);
    const rideLeaderId = req.body.ride_leader;
    const rideIsApproved = true;
    const editRideQuery = `
        UPDATE rides
        SET 
        rides_name = $1, 
        rides_category = $2, 
        rides_date = $3, 
        description = $4, 
        url = $5, 
        ride_location = $6, 
        approved = $7
        WHERE id = $8;`;
    pool.query(editRideQuery, [req.body.rides_name, req.body.rides_category, req.body.rides_date, req.body.description, req.body.url, req.body.ride_location, rideIsApproved, ride_id ])
        .then((result) => {
            
            console.log('success EDIT on ride: ', result);
            const overwriteDistancesQuery = `
                DELETE 
                FROM rides_distances
                WHERE ride_id = $1`;
            pool.query(overwriteDistancesQuery, [ride_id])
                .then((result)=>{
                    console.log('success on removing old distances: ', result);
                    const saveDistancesQuery = `
                    INSERT INTO rides_distances (ride_id, distance) 
                    VALUES($1, unnest($2::int[]))
                    RETURNING id, distance;`
                    pool.query(saveDistancesQuery, [ride_id, req.body.ride_distance])
                        .then((result) => {
                            const getDistancesQuery = `SELECT * FROM rides_distances WHERE ride_id = $1 ORDER BY distance DESC`
                            pool.query(getDistancesQuery,[ride_id])
                            .then((result)=>{
                                console.log('results of distances ordered by DESC: ', result.rows);
                                let rideLeaderDistance = result.rows[0].id;
                                const addRideLeaderToRideQuery = `
                                INSERT INTO rides_users (ride_id, user_id, selected_distance) 
                                VALUES ($1, $2, $3);`;
                                pool.query(addRideLeaderToRideQuery, [ride_id, rideLeaderId, rideLeaderDistance])
                                    .then((result)=>{
                                        console.log('success on adding ride leader to their ride.');
                                        
                                        res.sendStatus(201)
                                    })
                                    .catch((err)=>{
                                        console.log('error adding ride leader to their ride: ', err);
                                        
                                    })
                        })
                        .catch((err)=>{
                            console.log('error getting distances ordered by DESC: ', err);
                        
                            res.sendStatus(500);
                        })
                })
                .catch((err) => {
                    console.log('error making insert rides_distances query:', err);
                    res.sendStatus(500);
                });
                    
                })
            .catch((err)=>{
                console.log('error deleting ride distances: ', err);
                   
            })
            
        })
        // error handling
        .catch((err) => {
            console.log('error making UPDATE rides query:', err);
            res.sendStatus(500);
      });



})






//Ride leader get info for check in view
router.get(`/rideLeader/currentRide/:rideId`, isAuthenticated, (req, res) => {
    const queryText = `
    SELECT rides.id AS ride_id, array_agg(rides_distances.distance) AS ride_distance, array_agg(rides_distances.id) AS ride_distance_id, rides.rides_name,rides.rides_date,rides.description,rides.url,rides.ride_location, rides.ride_leader, rides.approved, rides.completed,rides. cancelled, rides.ride_category, users.first_name, users.last_name,users.phone_1,users.email, categories.type
    FROM rides 
    JOIN rides_distances on rides.id = rides_distances.ride_id
    JOIN users on rides.ride_leader = users.id
    JOIN categories on rides.ride_category = categories.id
    WHERE rides.id = $1
    GROUP BY rides.id, users.first_name, users.last_name, users.phone_1,users.email, categories.type`;
    pool.query(queryText, [req.params.rideId])
        .then((response) => {
            console.log('get current ride info ', response.rows);
            res.send(response.rows);
        })
        .catch((err) => {
            console.log('get current ride err ', err);
        });
    // res.send(list);
});

// Ride Leader Mark Ride as cancelled
router.put('/rideLeader/cancelRide/:rideId', isAuthenticated, (req, res) => {
    console.log('ride id to cancel ', req.params.rideId);
    const queryText = `
    UPDATE rides
    SET cancelled = $1
    WHERE id = $2`;
    pool.query(queryText, [true, req.params.rideId])
        .then((result) => {
            console.log('result update cancel ride ', result);
            res.sendStatus(201);
        })
        // error handling
        .catch((err) => {
            console.log('error making update cancel query:', err);
            res.sendStatus(500);
        });
});


// Ride Leader Mark toggle member check in
router.put('/rideLeader/toggleCheckIn', isAuthenticated, (req, res) => {
    console.log('ride id to cancel ', req.params.rideId);
    console.log('req.body ', req.body);
    const queryText = `
    UPDATE rides_users
    SET checked_in = $1
    WHERE user_id = $2
    AND ride_id = $3;`;
    pool.query(queryText, [req.body.checked_in, req.body.user_id, req.body.ride_id])
        .then((result) => {
            console.log('result update check in user ', result);
            res.sendStatus(201);
        })
        // error handling
        .catch((err) => {
            console.log('error making update check in user:', err);
            res.sendStatus(500);
        });
});

// Ride Leader Mark Ride as Complete
router.put('/rideLeader/complete/:rideId', isAuthenticated, (req, res) => {
    console.log('ride id to mark complete ', req.params.rideId);
    const queryText = `
    UPDATE rides
    SET completed = true
    WHERE id = $1
    AND ride_leader = $2
    RETURNING id, ride_leader`;
    pool.query(queryText, [req.params.rideId, req.user.id])
        .then((result) => {
            let updateReturn = result.rows[0]
            console.log('result update comeplete ride ', updateReturn);
            console.log('ride id to mark complete ', req.params.rideId);
            if (updateReturn.ride_leader === req.user.id) {
                const queryText = `
                UPDATE rides_users
                SET actual_distance = rides_distances.distance
                FROM rides_distances
                WHERE rides_users.selected_distance = rides_distances.id
                AND rides_users.ride_id = $1
                AND checked_in = true;`;
                pool.query(queryText, [updateReturn.id])
                    .then((result) => {
                        console.log('result update comeplete ride ', result);
                        res.sendStatus(201);
                    })
                    // error handling
                    .catch((err) => {
                        console.log('error making update completed query:', err);
                        res.sendStatus(500);
                    });
            } else{
                res.send('User is not the correct ride leader for ride');
            }
         
        })
        // error handling
        .catch((err) => {
            console.log('error making update completed query:', err);
            res.sendStatus(500);
        });
});


//Add Guest rider to db
router.post(`/rideLeader/addGuest`, isAuthenticated, (req, res) => {
    console.log('req.body ', req.body);
    const query = `
    INSERT INTO users (first_name, last_name, phone_1, email, role) 
    VALUES ($1, $2, $3, $4, $5)`;
    pool.query(query, [req.body.first_name, req.body.last_name, req.body.phone_1, req.body.email, 4])
        .then((result) => {
            res.sendStatus(201);
        })
        // error handling
        .catch((err) => {
            console.log('error making insert query:', err);
            res.sendStatus(500);
        });

});



module.exports = router;