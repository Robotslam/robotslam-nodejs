# RobotSlam Server

This is the RobotSlam Server, written in Node.JS using ECMAScript 2017.

## Requirements
* Node v7.6
* Postgres v9.5

## Development

During development it is recommended to use
[nodemon](https://github.com/remy/nodemon) since it automatically
restart the application when it detects a file change.

But it's also possible to run it using `npm start`.

The application uses the `ROS_MASTER_URI` environment variable to decide
on which host it should attempt to connect to.

## Production
Prior to deploying, the clientside JavaScript has to be built
```bash
npm run client:build
```

The production environment is an EC2 server, which can be accessed on
https://robotslam.thinxmate.com.

The server can then be started in production mode using:
```bash
NODE_ENV=production npm start
```
