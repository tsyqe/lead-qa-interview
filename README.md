# Welcome to Biobot Search

## Objective
Using the test suite of your choice, thoroughly test a search for kits page with 3 hours of effort. 

## Brief
Biobot customers receive a kit with tubes inside of it, which the customer uses to collect samples, and later sends the kit back to the Biobot lab. Your task is to test a search with an autocomplete functionality that our customers use to track the shipping status of that kit. Each kit has a label on it with a unique kit identifier and FedEx tracking number with the format xx-xxx-xxxx.

## Available Scripts
#### `npm start`
Opens two terminal tabs, one for `npm run frontend`, one for `npm run backend`. On MacOS, terminal needs accessibility access and will prompt the user to allow the action. Otherwise, to run the app, open two terminals. In one terminal, run `npm run frontend` in another terminal run `npm run backend`.

#### `npm run frontend`
Runs the app in the development mode at [http://localhost:3000](http://localhost:3000).

#### `npm run backend`
Runs the backend using json-server at [http://localhost:4000](http://localhost:4000). To retrieve shipping data: [http://localhost:4000/shipping_data](http://localhost:4000/shipping_data).

#### `npm run build`
Builds the app for production to the `build` folder. Bundles React in production mode and optimizes the build for the best performance. The build is minified and the filenames include the hashes. [Deployment info here](https://facebook.github.io/create-react-app/docs/deployment).

## Tests
These tests can be run against `localhost` as per above steps.  The tests are using [Cypress](https://www.cypress.io) E2E framework to execute.

## Test Configuration
Env variables are currently configured in `cypress.config.js` and additional configurations can be added as needed.  
A `cypress.env.json` file can be created locally that will override values defined in `cypress.config.js` (in the `env` section).  
Run configuration scripts can also be modified in `package.json` to run in other browsers or only running specific spec files.

## Running Tests
#### `npm ci`
(requires npm@5.7)
To pull down latest packages including the Cypress framework.

#### `npm test`
Currently configured to run in headless mode using Chrome browser.  
Configuration can be changed to run with other browsers that are installed on the local machine by modifying the `scripts` in `package.json`.

#### `npm run cy-open`
To watch the tests run in a headful browser, this command will open up the Cypress UI application and a locally installed browser.  Useful for debugging and observing failures in real time or with the 'rewind' option.  Currently configured to use the Firefox browser.  
Configuration can be changed to run with other browsers that are installed on the local machine by modifying the `scripts` in `package.json`.

## Developing Tests
Tests are located in `/cypress/e2e`. They are written in Javascript and can be run individually through the UI or in headless terminal.
Custom commands have been created to target common page objects and actions and they can be viewed in `/cypress/support/commands.js`.
