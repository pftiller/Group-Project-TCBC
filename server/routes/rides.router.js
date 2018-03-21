const express = require('express');
const router = express.Router();
const isAuthenticated = require('../modules/isAuthenticated');
const isAdminAuthorized = require('../modules/isAdminAuthorized');
const isRideLeaderAuthorized = require('../modules/isRideLeaderAuthorized');
const pool = require('../modules/pool');
const ridePackager = require('../modules/ridePackager.module');
const sortDataForCharts = require('../modules/lineChartDataSorter.module');



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
router.get('/admin/pendingApprovedRides', isAuthenticated, isAdminAuthorized, (req, res) => {
    const allRidesQuery = `SELECT rides.id AS ride_id, array_agg(rides_distances.distance) AS ride_distance, array_agg(rides_distances.id) AS ride_distance_id, rides.rides_name,rides.rides_date, rides.rides_category, rides.description,rides.url,rides.ride_location, rides.ride_leader,rides.approved,rides.completed,rides.cancelled, users.first_name, users.last_name,users.phone_1,users.email
    FROM rides 
    JOIN rides_distances on rides.id = rides_distances.ride_id
    JOIN users on rides.ride_leader = users.id
    WHERE approved = false
    GROUP BY rides.id, users.first_name, users.last_name, users.phone_1,users.email`;
    pool.query(allRidesQuery)
        .then((result) => {
            let formattedRides = ridePackager(result.rows);
            res.send(formattedRides);
        })
        .catch((err) => {
            console.log('error getting all rides');
            res.sendStatus(500);
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
            res.send(result.rows);
        })
        .catch((err) => {
            console.log('error getting all my rides', err);
            res.sendStatus(500);
        })
});

router.get('/member/rideDetails', isAuthenticated, (req, res) => {
    const allRidesQuery = `SELECT * FROM rides
    JOIN rides_users on rides_users.ride_id = rides.id
    WHERE rides_users.user_id = $1
    AND rides.cancelled = false
    AND rides.completed = false
    AND rides.approved = true
    AND rides.ride_leader != $1;`
    pool.query(allRidesQuery, [req.user.id])
        .then((result) => {
            res.send(result.rows);
        })
        .catch((err) => {
            console.log('error getting all my rides', err);
            res.sendStatus(500);
        })
});

router.get('/rideLeader/leadRideDetails', isAuthenticated, isRideLeaderAuthorized, (req, res) => {
    const allRidesQuery = `SELECT * FROM rides
    JOIN rides_users on rides_users.ride_id = rides.id
    WHERE rides_users.user_id = $1
    AND rides.ride_leader = $1
    AND rides.cancelled = false
    AND rides.approved = true
    AND rides.completed = false;`
    pool.query(allRidesQuery, [req.user.id])
        .then((result) => {
            res.send(result.rows);
        })
        .catch((err) => {
            console.log('error getting all my leading rides', err);
            res.sendStatus(500);
        })
});

router.get('/member/pastRideDetails', isAuthenticated, (req, res) => {
    const allRidesQuery = `SELECT * FROM rides
    JOIN rides_users on rides_users.ride_id = rides.id
    WHERE rides_users.user_id = $1
    AND rides.completed = true
    AND rides.cancelled = false
    AND rides.approved = true;`
    pool.query(allRidesQuery, [req.user.id])
        .then((result) => {
            res.send(result.rows);
        })
        .catch((err) => {
            console.log('error getting all my past rides', err);
            res.sendStatus(500);
        })
});

router.get('/admin/pastRideDetails/:member_id', isAuthenticated, isAdminAuthorized, (req, res) => {
    const allRidesQuery = `
    SELECT * FROM rides
    JOIN rides_users on rides_users.ride_id = rides.id
    WHERE rides_users.user_id = $1
    AND rides.completed = true
    AND rides.cancelled = false
    AND rides.approved = true;`
    pool.query(allRidesQuery, [req.params.member_id])
        .then((result) => {
            res.send(result.rows);
        })
        .catch((err) => {
            console.log('error getting all my past rides', err);
            res.sendStatus(500);
        })
});
router.get('/member/mileage', isAuthenticated, (req, res) => {
    const queryText = `
    SELECT SUM( actual_distance ) 
    FROM rides_users
    JOIN users ON rides_users.user_id = users.id
    WHERE rides_users.user_id = $1;`
    pool.query(queryText, [req.user.id])
        .then((result) => {
            res.send(result.rows[0]);
        })
        .catch((err) => {
            console.log('error getting user mileage', err);
            res.sendStatus(500);
        })
});

router.get(`/rideLeader/signedUpRiders/:rideId`, isAuthenticated, isRideLeaderAuthorized, (req, res) => {
    const queryText = `
    SELECT * FROM users
    JOIN rides_users on rides_users.user_id = users.id
    WHERE rides_users.ride_id = $1;`
    pool.query(queryText, [req.params.rideId])
        .then((result) => {
            res.send(result.rows);
        })
        .catch((err) => {
            console.log('error getting users for ride check in', err);
            res.sendStatus(500);
        })

});

/* GET search for member */
router.get('/ride-leader/searchMembers/:first_name/:last_name/:member_id', isAuthenticated, isRideLeaderAuthorized, (req, res) => {
    req.params.member_id;
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

router.post('/signUp', isAuthenticated, (req, res) => {
    const query = `
    INSERT INTO rides_users (ride_id, user_id, selected_distance) 
    VALUES ($1, $2, $3)`;
    pool.query(query, [req.body.ride_id, req.user.id, req.body.selected_distance])
        .then((result) => {
            res.sendStatus(201);
        })
        .catch((err) => {
            console.log('error making insert query:', err);
            res.sendStatus(500);
        });
});

router.post('/ride-leader/sign-up-member', isAuthenticated, isRideLeaderAuthorized, (req, res) => {
    let ride = req.body.current;
    let member = req.body.member;
    const getDistancesQuery = `
        SELECT * FROM rides_distances 
        WHERE ride_id = $1 
        ORDER BY distance DESC`
    pool.query(getDistancesQuery, [ride.ride_id])
        .then((result) => {
            let selectedMaxDistance = result.rows[0].id;
            const query = `
                INSERT INTO rides_users (ride_id, user_id, selected_distance) 
                VALUES ($1, $2, $3)`;
            pool.query(query, [ride.ride_id, member.id, selectedMaxDistance])
                .then((result) => {
                    res.sendStatus(201);
                })
                // error handling
                .catch((err) => {
                    console.log('error making insert query:', err);
                    res.sendStatus(500);
                });
        })
        .catch((err) => {
            console.log('error making select ride for sign up insert query:', err);
            res.sendStatus(500);
        });
})

router.delete('/unregister/:ride_id/', isAuthenticated, (req, res) => {
    const queryText = `
    DELETE FROM rides_users
    WHERE ride_id = $1
    AND user_id = $2`;
    pool.query(queryText, [req.params.ride_id, req.user.id])
        .then((result) => {
            res.sendStatus(201);
        })
        .catch((err) => {
            console.log('error making update completed query:', err);
            res.sendStatus(500);
        });
});

/* RideLeader Submit Ride for Approval */
router.post('/rideLeader/submitRide', isAuthenticated, isRideLeaderAuthorized, (req, res) => {
    const saveRideQuery = `
    INSERT INTO rides (rides_name, rides_category, rides_date, description, ride_leader, url, ride_location) 
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id;`;
    pool.query(saveRideQuery, [req.body.rides_name, req.body.rides_category, req.body.rides_date, req.body.description, req.user.id, req.body.url, req.body.ride_location])
        .then((result) => {
            let ride_id = result.rows[0].id;
            const saveDistancesQuery = `
            INSERT INTO rides_distances (ride_id, distance) 
            VALUES($1, unnest($2::int[]))
            RETURNING id, distance;`
            pool.query(saveDistancesQuery, [ride_id, req.body.distances])
                .then((result) => {
                    res.sendStatus(201);
                })
                .catch((err) => {
                    console.log('error making insert rides_distances query:', err);
                    res.sendStatus(500);
                });
        })
        .catch((err) => {
            console.log('error making insert rides query:', err);
            res.sendStatus(500);
        });

});

router.put('/admin/editRide/actualMileage', isAuthenticated, isAdminAuthorized, (req, res) => {
    const updateActualMileageQuery = `
        UPDATE rides_users
        SET actual_distance = $1 
        WHERE ride_id = $2
        AND user_id = $3;`;
    pool.query(updateActualMileageQuery, [req.body.mileage, req.body.ride_id, req.body.user_id])
        .then((result) => {
            res.sendStatus(200);
        })
        .catch((err) => {
            console.log('put query actual miles err', err);
            res.sendStatus(500);
        })

})

/* Ride Approval and Sign up Ride Leader to ride with longest distance*/
router.put('/admin/approveAndSave', isAuthenticated, isAdminAuthorized, (req, res) => {
    const ride_id = req.body.ride_id;
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
    pool.query(editRideQuery, [req.body.rides_name, req.body.rides_category, req.body.rides_date, req.body.description, req.body.url, req.body.ride_location, rideIsApproved, ride_id])
        .then((result) => {
            const overwriteDistancesQuery = `
                DELETE 
                FROM rides_distances
                WHERE ride_id = $1`;
            pool.query(overwriteDistancesQuery, [ride_id])
                .then((result) => {
                    const saveDistancesQuery = `
                    INSERT INTO rides_distances (ride_id, distance) 
                    VALUES($1, unnest($2::int[]))
                    RETURNING id, distance;`
                    pool.query(saveDistancesQuery, [ride_id, req.body.ride_distance])
                        .then((result) => {
                            const getDistancesQuery = `SELECT * FROM rides_distances WHERE ride_id = $1 ORDER BY distance DESC`
                            pool.query(getDistancesQuery, [ride_id])
                                .then((result) => {
                                    let rideLeaderDistance = result.rows[0].id;
                                    const addRideLeaderToRideQuery = `
                                INSERT INTO rides_users (ride_id, user_id, selected_distance) 
                                VALUES ($1, $2, $3);`;
                                    pool.query(addRideLeaderToRideQuery, [ride_id, rideLeaderId, rideLeaderDistance])
                                        .then((result) => {
                                            res.sendStatus(201)
                                        })
                                        .catch((err) => {
                                            console.log('error adding ride leader to their ride: ', err);
                                            res.sendStatus(500);
                                        })
                                })
                                .catch((err) => {
                                    console.log('error getting distances ordered by DESC: ', err);
                                    res.sendStatus(500);
                                })
                        })
                        .catch((err) => {
                            console.log('error making insert rides_distances query:', err);
                            res.sendStatus(500);
                        })

                })
                .catch((err) => {
                    console.log('error deleting ride distances: ', err);
                    res.sendStatus(500);

                })
        })
        // error handling
        .catch((err) => {
            console.log('error making UPDATE rides query:', err);
            res.sendStatus(500);
        });
})

//Ride leader get info for check in view
router.get(`/rideLeader/currentRide/:rideId`, isAuthenticated, isRideLeaderAuthorized, (req, res) => {
    const queryText = `
    SELECT rides.id AS ride_id, array_agg(rides_distances.distance) AS ride_distance, array_agg(rides_distances.id) AS ride_distance_id, rides.rides_name,rides.rides_date,rides.description,rides.url,rides.ride_location, rides.ride_leader, rides.approved, rides.completed,rides. cancelled, rides.rides_category, users.first_name, users.last_name,users.phone_1,users.email, categories.type
    FROM rides 
    JOIN rides_distances on rides.id = rides_distances.ride_id
    JOIN users on rides.ride_leader = users.id
    JOIN categories on rides.rides_category = categories.id
    WHERE rides.id = $1
    GROUP BY rides.id, users.first_name, users.last_name, users.phone_1,users.email, categories.type`;
    pool.query(queryText, [req.params.rideId])
        .then((response) => {
            res.send(response.rows);
        })
        .catch((err) => {
            console.log('get current ride err ', err);
        });
});

// Ride Leader Mark Ride as cancelled
router.put('/rideLeader/cancelRide/:rideId', isAuthenticated, isRideLeaderAuthorized, (req, res) => {
    const queryText = `
    UPDATE rides
    SET cancelled = $1
    WHERE id = $2`;
    pool.query(queryText, [true, req.params.rideId])
        .then((result) => {
            res.sendStatus(201);
        })
        .catch((err) => {
            console.log('error making update cancel query:', err);
            res.sendStatus(500);
        });
});

// Ride Leader Mark toggle member check in
router.put('/rideLeader/toggleCheckIn', isAuthenticated, isRideLeaderAuthorized, (req, res) => {
    const queryText = `
    UPDATE rides_users
    SET checked_in = $1
    WHERE user_id = $2
    AND ride_id = $3;`;
    pool.query(queryText, [req.body.checked_in, req.body.user_id, req.body.ride_id])
        .then((result) => {
            res.sendStatus(201);
        })
        .catch((err) => {
            console.log('error making update check in user:', err);
            res.sendStatus(500);
        });
});

// Ride Leader Mark Ride as Complete
router.put('/rideLeader/complete/:rideId', isAuthenticated, isRideLeaderAuthorized, (req, res) => {
    const queryText = `
    UPDATE rides
    SET completed = true
    WHERE id = $1
    AND ride_leader = $2
    RETURNING id, ride_leader`;
    pool.query(queryText, [req.params.rideId, req.user.id])
        .then((result) => {
            let updateReturn = result.rows[0]
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
                        res.sendStatus(201);
                    })
                    .catch((err) => {
                        console.log('error making update completed query:', err);
                        res.sendStatus(500);
                    });
            } else {
                res.send('User is not the correct ride leader for ride');
            }

        })
        .catch((err) => {
            console.log('error making update completed query:', err);
            res.sendStatus(500);
        });
});

//Add Guest rider to db
router.post(`/rideLeader/addGuest/:ride_id`, isAuthenticated, isRideLeaderAuthorized, (req, res) => {
    const guestInsertQuery = `
    INSERT INTO users (first_name, last_name, phone_1, email, role) 
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id`;
    pool.query(guestInsertQuery, [req.body.first_name, req.body.last_name, req.body.phone_1, req.body.email, 4])
        .then((result) => {
            let user_id = result.rows[0].id;
            const getDistancesQuery = `
                    SELECT * FROM rides_distances 
                    WHERE ride_id = $1 
                    ORDER BY distance DESC`
            pool.query(getDistancesQuery, [req.params.ride_id])
                .then((result) => {
                    let selectedMaxDistance = result.rows[0].id;
                    const query = `
                            INSERT INTO rides_users (ride_id, user_id, selected_distance, checked_in, waiver_signed) 
                            VALUES ($1, $2, $3, $4, $5)`;
                    pool.query(query, [req.params.ride_id, user_id, selectedMaxDistance, true, req.body.waiver_signed])
                        .then((result) => {
                            res.sendStatus(201);
                        })
                        .catch((err) => {
                            console.log('error inserting rides_users guest query:', err);
                            res.sendStatus(500);
                        });

                })
                .catch((err) => {
                    console.log('error getting rides_distances for getDistanceQuery:', err);
                    res.sendStatus(500);
                });
        })
        .catch((err) => {
            console.log('error inserting users for guestInsertQuery:', err);
            res.sendStatus(500);
        });
});



/* Line Graph Data fetch */
router.get('/stats', isAuthenticated, (req, res) => {
    const userId = req.user.id;
    const milesDateQuery = `
    SELECT rides_users.actual_distance as distance_biked, rides.rides_date as date
    FROM rides_users
    JOIN rides ON rides_users.ride_id = rides.id
    WHERE rides_users.user_id = $1
    ORDER BY date ASC`;
    pool.query(milesDateQuery, [userId])
        .then((result) => {
            let sortedData = sortDataForCharts(result.rows);
            res.send(sortedData);
        })
        .catch((err) => {
            console.log('failed to get miles/date data for line char: ', err);
            res.sendStatus(500);
        })
})

module.exports = router;