# Sce-Api



## Contribution Guide

- Clone the repository and configure the codebase locally following the instructions in the READMe.md file
- Make sure your code lints properly.
- Commit your work to git using a descriptive message relevant to the purpose of the pull request.
- Issue the pull request.
- Add a relevant description of what the PR is about.
- Address a single concern in the least number of changed lines as possible.
- Share the PR link with collaborating developer for review



## What you need 

- Hardware: A working PC + Internet
- Software: IDE, PGADMIN(optional if can use the terminal)
- Pre - installations: Node, Postgres, 

---


## Start server locally

Once cloned, and have your database values ready in the env:

run this script to have all the dependencies ready

    $ npm install 


run this script in your root code terminal

    $ npm run scello

---


## Running up existing migrations

Open up the sequelize folder in your integrated terminal and run these commands in your code terminal in the stated order to run up the sql migrations first then the seed migrations next

    $ npx sequelize-cli db:migrate
    $ npx sequelize-cli db:seed:all
---


## Running down all existing migrations

Open up the sequelize folder in your integrated terminal and run these commands in your code terminal in the stated order to run down the seed migrations first then the sql migrations next

    $ npx sequelize-cli db:seed:undo:all
    $ npx sequelize-cli db:migrate:undo:all
---


## creating new models/tables

Open up the sequelize folder in your integrated terminal and run these commands in your code terminal in the stated order to create new models

    $ npx sequelize-cli model:generate --name <modelName> --attributes "fIeLdS"
    $ Exanple: npx sequelize-cli model:generate --name Orders --attributes "order_id:string,user_id:string,amount:decimal,status:string,deleted_at:date"

---



## Adding new migrations

Open up the sequelize folder in your integrated terminal and run these commands in your code terminal in the stated order to create either a new migration or seeder migration

    $ npx sequelize-cli migration:generate --name "MIGRATION-FILE-NAME"
    $ npx sequelize-cli seed:generate --name "MIGRATION-FILE-NAME"
---


## The below are the necessary ENVs you need when running the application on your local host. 
## You can use jwt to generate your own secret keys when working on your local machine esp for SCELLO_DEV_ACCESS_TOKEN_SECRET & SCELLO_DEV_REFRESH_TOKEN_SECRET as they are being used in the onboarding endpoints.

SCELLO_NODE_ENV=development
SCELLO_DEV_PORT=4000
SCELLO_DEV_SECRET_KEY=
SCELLO_DEV_ACCESS_TOKEN_SECRET=
SCELLO_DEV_REFRESH_TOKEN_SECRET=
SCELLO_DEV_REFRESH_TOKEN_EXPIRATION=7d
SCELLO_DEV_ACCESS_TOKEN_EXPIRATION=5h

SCELLO_DEV_EXPIRATION_IN_MINUTES=50
 
SCELLO_DEV_DATABASE_USERNAME=postgres
SCELLO_DEV_DATABASE_PASSWORD=<yOuRpAsSwOrD>
SCELLO_DEV_DATABASE_NAME=scellodb
SCELLO_DEV_DATABASE_HOST=localhost
SCELLO_DEV_DATABASE_DIALECT=postgres

SCELLO_DEV_BCRYPT_SALT_ROUND=10

---



## The APIs are as follows

    $ - GET /users: Returns a list of all users.
    $ - POST /users: Creates a new user.
    $ - DELETE /users/:id: Deletes a user by ID. 
    $ - GET /orders: Returns a list of all orders. 
    $ - POST /orders: Creates a new order. 
    $ - PATCH /orders: Cancel an order. 
    $ - GET /end-of-day-report: Get total Amount Order and Total Amount Order at the end of the day.

---


## NB: The create user flow consists of 4 endpoint and you are to follow as stated below

- Sign Up: Enter your phone number and a you get an otp (The email otp was not implemented but you can get the otp in the response body).
- Verify Phone Number: Enter the correct otp(use the jwt token from the response to access the next endpoint).
- Complete Profile: Fill in your other details(first_name, last_name etc) . 
- Login: Enter your phone number and password (The email otp was not implemented but you can get the otp in the response body).
- Verify Login: Enter the correct otp(use the jwt token from the response to access the all other endpoints not stated here). 

---
    