# Ariel's MERN project
### references
- [SalarC123 on dev.to (authentication related source code)](https://dev.to/salarc123/mern-stack-authentication-tutorial-part-2-the-frontend-gen)
- [MERN MongoDB tutorial](https://www.mongodb.com/languages/mern-stack-tutorial)
- [Sameuele Zaza on koyeb.com (search)](https://www.koyeb.com/tutorials/add-full-text-search-with-mongodb-atlas-and-mern#add-search-index)
### notes
- authentication
    - use separate authenticate function
    - useNavigate replaces useHistory
    - [use multiple routes](https://riptutorial.com/express/example/16315/multiple-routes)
    - [mongodb aggregation](https://www.mongodb.com/docs/drivers/node/current/fundamentals/aggregation/)

##Setup Tutorial

###Step 1
- Prepare an environment with Node and Yarn
- Clone this repository
- 
- Yarn Installations (root directory)
    - yarn add nodemon --save-dev
    - yarn add cors
    - yarn add mongoose
    - yarn add jsonwebtoken
- Yarn Installations (client directory)
    - yarn add axios react-router-dom react-hook-form
    - yarn add bootstrap@5.1.3 react-bootstrap
    - yarn add react-simple-maps

###Step 2
- Login to your MongoDB account
- From the "Database Deployments" page, click "Build a Database".
- Choose the free "shared" plan
- Name the cluster "mapsite" and click "create cluster"
- Select "Username & Password" authentication option, enter a username and password and click the "Create User button". Store the username and password somewhere safe
- Navigate to your cluster's page, and whitelist your IP address.
- Click the "Connect" button next to your MongoDB cluster name, select the "Connect your application" option and copy your database connection string to a .env file, which you should place in root directory.

###Step 3: test
- in one terminal tab, run "yarn dev" from the root directory, then navigate on your browser to localhost:3000
    - you should see a welcome to Express message*
- navigate to client directory and run "yarn start"
    - hit enter when it asks to use another port, likely 3001
- if any other packages need installation, error messages should let you know. just use "yarn add" in the appropriate directory.




