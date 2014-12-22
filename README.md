# Sprinter

## Dependencies

You need [nodejs and npm](http://nodejs.org) to install dependencies/build this project, and [grunt/grunt-cli](https://github.com/gruntjs/grunt-cli) if you want to develop.

## Setup

```
npm install
cp .env.dist .env
bower install
```
In case the application is being run as root, run `bower install --allow-root` for installing the bower dependencies. This will create the `sprinter/app/bower_components` which will be used by `grunt` to compile the less files.

## Run

```
npm start
```

Your app should be running at `http://localhost:1950`

## Configuration

Your configuration should be stored in a `.env` file. See .env-dist for a list/description of all configuration.

*TODO: describe each config variable*

## Development

Instead of running `npm start`, run `grunt` instead. This will make sure your front end assets compile when changed.

