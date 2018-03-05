CREATE TABLE "users" (
	"id" int NOT NULL,
	"password" varchar(255) NOT NULL,
	"first_name" varchar(50) NOT NULL,
	"last_name" varchar(50) NOT NULL,
	"phone_1" int NOT NULL,
	"email" varchar(50),
	"role" int NOT NULL,
	"member_id" int NOT NULL,
	CONSTRAINT users_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "rides" (
	"id" serial NOT NULL,
	"rides_name" varchar(50) NOT NULL,
	"rides_category" varchar(25) NOT NULL,
	"rides_date" DATE NOT NULL,
	"description" varchar(100) NOT NULL,
	"ride_leader" int NOT NULL,
	"url" varchar(255) NOT NULL,
	"approved" BOOLEAN NOT NULL,
	"completed" BOOLEAN NOT NULL,
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
	"phone_1" varchar(12) NOT NULL,
	"phone_2" varchar(12) NOT NULL,
	"email" varchar(50) NOT NULL,
	CONSTRAINT member_info_pk PRIMARY KEY ("member_id")
) WITH (
  OIDS=FALSE
);

ALTER TABLE "public"."rides" ADD COLUMN "ride_location" text;

ALTER TABLE "users" ADD CONSTRAINT "users_fk0" FOREIGN KEY ("role") REFERENCES "user_roles"("id");
ALTER TABLE "users" ADD CONSTRAINT "users_fk1" FOREIGN KEY ("member_id") REFERENCES "member_info"("member_id");

ALTER TABLE "rides" ADD CONSTRAINT "rides_fk0" FOREIGN KEY ("ride_leader") REFERENCES "users"("id");


ALTER TABLE "rides_users" ADD CONSTRAINT "rides_users_fk0" FOREIGN KEY ("ride_id") REFERENCES "rides"("id");
ALTER TABLE "rides_users" ADD CONSTRAINT "rides_users_fk1" FOREIGN KEY ("user_id") REFERENCES "users"("id");
ALTER TABLE "rides_users" ADD CONSTRAINT "rides_users_fk2" FOREIGN KEY ("selected_distance") REFERENCES "rides_distances"("id");

ALTER TABLE "rides_distances" ADD CONSTRAINT "rides_distances_fk0" FOREIGN KEY ("ride_id") REFERENCES "rides"("id");


