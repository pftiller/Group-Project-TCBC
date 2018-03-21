# Name of Project

Twin Cities Bicycle Club

## Built With

HTML/CSS
AngularJS
AngularJS Material
Angular-route
Chart.js
justGage
Moment.js
responsive-tables
SweetAlert
Express.js
Node.js
Passport
Moment.js
PostgreSQL

## Getting Started

- Fork the Repo to your GitHub and Clone it to your local work environment.  
- Navigate to the project directory and run npm install to install all dependencies.
- Create a database called tcbc in postgreSQL.
- Follow the TCBC_Postgres_Create_Final.sql file for a list of all SQL scripts to run in order to build out the database tables.
- Once the tables are built, you will need to populate some of the tables with information. These are also found in the TCBC_Postgres_Create_Final.sql file. 
### Prerequisites

The following software will be required in order to get this project to work.

- [Node.js](https://nodejs.org/en/)
- [postgreSQL] (https://www.postgresql.org/download/)



### Installing

Steps to get the development environment running.

```sql
CREATE TABLE "users" (
  "id" serial primary key,
  "username" varchar(80) not null UNIQUE,
  "password" varchar(240) not null
);
```

## Screen Shot

Include one or two screen shots of your project here (optional). Remove if unused.

## Documentation

Link to a read-only version of your scope document or other relevant documentation here (optional). Remove if unused.

### Completed Features

High level list of items completed.

- [x] Feature a
- [x] Feature b

### Next Steps

Features that you would like to add at some point in the future.

- [ ] Feature c

## Deployment

Add additional notes about how to deploy this on a live system

## Authors

* Name of author(s)


## Acknowledgments

* Hat tip to anyone who's code was used


