# Sprinter

## Dependencies

You need [nodejs and npm](http://nodejs.org) to install dependencies/build this project, and [grunt/grunt-cli](https://github.com/gruntjs/grunt-cli) if you want to develop.

## Setup

```
$ npm install
$ bower install
$ grunt
```
Instead of running `grunt`, run `npm start` instead on production.

Running `grunt` will make sure your front end assets compile when changed. In case the application is being run as root, run `bower install --allow-root` for installing the bower dependencies. This will create the `sprinter/app/bower_components` which will be used by `grunt` to compile the less files.

Your app should be running at `http://localhost:1337`
