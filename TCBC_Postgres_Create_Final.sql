CREATE TABLE "users" (
  "id" serial NOT NULL,
  "password" varchar(255) NOT NULL,
  "first_name" varchar(50) NOT NULL,
  "last_name" varchar(50) NOT NULL,
  "phone_1" varchar(12) NOT NULL,
  "email" varchar(50),
  "role" int NOT NULL,
  "member_id" int,
  CONSTRAINT users_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);


CREATE TABLE "rides" (
  "id" serial NOT NULL,
  "rides_name" varchar(50) NOT NULL,
  "rides_category" varchar(25) NOT NULL,
  "rides_date" TIMESTAMP NOT NULL,
  "description" text NOT NULL,
  "ride_leader" int NOT NULL,
  "url" varchar(255),
  "approved" BOOLEAN NOT NULL DEFAULT 'false',
  "completed" BOOLEAN NOT NULL DEFAULT 'false',
  "cancelled" BOOLEAN NOT NULL DEFAULT 'false',
  CONSTRAINT rides_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "user_roles" (
  "id" serial NOT NULL,
  "role" varchar(25) NOT NULL,
  CONSTRAINT user_roles_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "rides_users" (
  "id" serial NOT NULL,
  "ride_id" int NOT NULL,
  "user_id" int NOT NULL,
  "actual_distance" int NOT NULL,
  "selected_distance" int NOT NULL,
  "checked_in" BOOLEAN NOT NULL,
  "waiver_signed" BOOLEAN,
  CONSTRAINT rides_users_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "rides_distances" (
  "id" serial NOT NULL,
  "ride_id" int NOT NULL,
  "distance" int NOT NULL,
  CONSTRAINT rides_distances_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "member_info" (
  "member_id" int NOT NULL,
  "membership_start" DATE NOT NULL,
  "membership_expiration" DATE NOT NULL,
  "first_name" varchar(50) NOT NULL,
  "middle_name" varchar(50) NOT NULL,
  "last_name" varchar(50) NOT NULL,
  "city" varchar(50) NOT NULL,
  "state" varchar(50) NOT NULL,
  "zip" varchar(50) NOT NULL,
  "gender" varchar(10) NOT NULL,
  "phone_1" varchar(12),
  "phone_2" varchar(12),
  "email" varchar(50),
  CONSTRAINT member_info_pk PRIMARY KEY ("member_id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" text,
	"name" text
	);







												-- Category Data --
												
INSERT INTO "public"."categories"("id", "type", "name") VALUES(1, 'A', 'Very Strenuous') RETURNING "id", "type", "name";
INSERT INTO "public"."categories"("id", "type", "name") VALUES(2, 'A/B', 'Strenuous') RETURNING "id", "type", "name";
INSERT INTO "public"."categories"("id", "type", "name") VALUES(3, 'B', 'Brisk') RETURNING "id", "type", "name";
INSERT INTO "public"."categories"("id", "type", "name") VALUES(4, 'B/C', 'Moderate') RETURNING "id", "type", "name";
INSERT INTO "public"."categories"("id", "type", "name") VALUES(5, 'C', 'Relaxed') RETURNING "id", "type", "name";
INSERT INTO "public"."categories"("id", "type", "name") VALUES(6, 'MB-A', 'Members Only') RETURNING "id", "type", "name";
INSERT INTO "public"."categories"("id", "type", "name") VALUES(7, 'MB-AB', 'Members Only') RETURNING "id", "type", "name";
INSERT INTO "public"."categories"("id", "type", "name") VALUES(8, 'MB-B', 'Members Only') RETURNING "id", "type", "name";
INSERT INTO "public"."categories"("id", "type", "name") VALUES(9, 'MB-C', 'Members Only') RETURNING "id", "type", "name";
INSERT INTO "public"."categories"("id", "type", "name") VALUES(10, 'N-A', 'Night') RETURNING "id", "type", "name";
INSERT INTO "public"."categories"("id", "type", "name") VALUES(11, 'N-A/B', 'Night') RETURNING "id", "type", "name";
INSERT INTO "public"."categories"("id", "type", "name") VALUES(12, 'N-B', 'Night') RETURNING "id", "type", "name";
INSERT INTO "public"."categories"("id", "type", "name") VALUES(13, 'N-B/C', 'Night') RETURNING "id", "type", "name";
INSERT INTO "public"."categories"("id", "type", "name") VALUES(14, 'N-C', 'Night') RETURNING "id", "type", "name";
INSERT INTO "public"."categories"("id", "type", "name") VALUES(15, 'O', 'Outreach') RETURNING "id", "type", "name";
INSERT INTO "public"."categories"("id", "type", "name") VALUES(16, 'S', 'Special') RETURNING "id", "type", "name";













											-- Foreign Key Restraints --


ALTER TABLE "users" ADD CONSTRAINT "users_fk0" FOREIGN KEY ("role") REFERENCES "user_roles"("id");
ALTER TABLE "users" ADD CONSTRAINT "users_fk1" FOREIGN KEY ("member_id") REFERENCES "member_info"("member_id");
ALTER TABLE "rides" ADD CONSTRAINT "rides_fk0" FOREIGN KEY ("ride_leader") REFERENCES "users"("id");
ALTER TABLE "rides_users" ADD CONSTRAINT "rides_users_fk0" FOREIGN KEY ("ride_id") REFERENCES "rides"("id");
ALTER TABLE "rides_users" ADD CONSTRAINT "rides_users_fk1" FOREIGN KEY ("user_id") REFERENCES "users"("id");
ALTER TABLE "rides_users" ADD CONSTRAINT "rides_users_fk2" FOREIGN KEY ("selected_distance") REFERENCES "rides_distances"("id");
ALTER TABLE "rides_distances" ADD CONSTRAINT "rides_distances_fk0" FOREIGN KEY ("ride_id") REFERENCES "rides"("id");
ALTER TABLE "public"."rides"
  ADD COLUMN "ride_category" integer,
  ADD FOREIGN KEY ("ride_category") REFERENCES "public"."categories"("id");






															-- TEST DATA --

INSERT INTO "public"."users"("id", "password", "first_name", "last_name", "email", "role", "member_id") VALUES(2, '$2a$10$qpFIlkXr.0TJZinWkjIBW.X3tjCipOlSUb6YFWpvzOOeOyqy3OoFK', 'RideLeader', 'Skywalker', 'test.email@gmail.com', 2, 11111) RETURNING "id", "password", "first_name", "last_name", "phone_1", "email", "role", "member_id";


SELECT * FROM categories;

SELECT * FROM rides;


SELECT rides.id AS ride_id, array_agg(rides_distances.distance) AS ride_distance, array_agg(rides_distance.id) AS ride_distance_id,
rides.rides_name,rides.rides_date,rides.description,rides.url,rides.ride_location, users.first_name,users.last_name,users.email,users.phone_1,categories.type,categories.name
FROM rides
JOIN rides_distances on rides.id = rides_distances.ride_id
JOIN users on rides.ride_leader = users.id
JOIN categories on rides.ride_category = categories.id
GROUP BY rides.id;



 --  Get all Rides and associated Data --

SELECT rides.id AS ride_id, array_agg(rides_distances.distance) AS ride_distance, array_agg(rides_distances.id) AS ride_distance_id, rides.rides_name,rides.rides_date,rides.description,rides.url,rides.ride_location, rides.ride_leader, users.first_name, users.last_name,users.phone_1,users.email
FROM rides 
JOIN rides_distances on rides.id = rides_distances.ride_id
JOIN users on rides.ride_leader = users.id
GROUP BY rides.id, users.first_name, users.last_name, users.phone_1,users.email;



