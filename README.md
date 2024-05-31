# Task Manager Application Backend

## Description

This is the backend for the Task Manager application. It is built using [NestJS](https://nestjs.com/), a progressive Node.js framework. It is a simple application that allows users to create, update, delete, and view tasks. It uses a MongoDB database to store tasks and to preserve the order of tasks in each status. The application is built using a microservices architecture, with the frontend and backend services running in separate containers. The frontend service communicates with the backend service using RESTful APIs.

## Getting Started

### Setting up MongoDB

1. Install MongoDB. If you have Homebrew installed, you can install MongoDB with:

   ```bash
   brew tap mongodb/brew
   brew install mongodb-community
   ```

2. Start the MongoDB service:

   ```bash
   brew services start mongodb/brew/mongodb-community
   ```

   Alternatively, you can start the MongoDB service manually:

   ```bash
   mongod --config /usr/local/etc/mongod.conf
   ```

3. Verify that MongoDB is running by connecting to the MongoDB shell:

```bash
mongo
```

You should see the MongoDB shell prompt if connected successfully.

### Configuration

Create a `.env` file in the root of the project and add the following environment variables:

```bash
MONGODB_URI=mongodb://localhost:27017/task-manager
```

### Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

The application will be running at [http://localhost:5001](http://localhost:5001).

## Test

All the tests are written at controller level, which is basically end-to-end testing to test the API endpoints and their functionality.

To run the tests, use the following command:

```bash
# unit tests
$ npm run test
```

# API Endpoints

### Tasks

The following endpoints are available for tasks:

- `GET /tasks`: Get all tasks
- `POST /tasks`: Create a new task
- `PATCH /tasks/:id`: Update a task by ID
- `DELETE /tasks/:id`: Delete a task by ID
- `DELETE /tasks`: Delete all tasks

### Sort Order (Order of Tasks in Each Status)

Sort order is maintained for each status to preserve the order of tasks. The following endpoints are available to update the sort order of tasks in each status:

- `PATCH /sort-orders`: Update the sort order of tasks in each status
- `GET /sort-orders`: Get the sort order of tasks in each status
- `DELETE /sort-orders`: Delete the sort order of tasks in each status
- `POST /sort-orders`: Create a new sort order for tasks in each status

Please Refer to the source code and test files for more detailed usage.

# Database

The application uses a MongoDB database to store tasks. The database connection string can be configured in the `.env` file.
