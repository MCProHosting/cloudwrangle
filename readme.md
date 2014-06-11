# CloudWrangle

CloudWrangle was built as an application to manage very large numbers of domain records from CloudFlare. It should be noted that CloudWrangle is for personal use and should *never* be run on a public-facing server.

This application was (90%) developed on an international flight because there was nothing else to do, so it may not be the most perfect code ever (don't hate). We do, of course, welcome improvements and pull requests.

### Using CloudWrangle

Before running:

1. Ensure NodeJS is installed on your system.
2. Copy `dist/config/config.example.json` to `dist/config/config.json`, and edit to fit your details accordingly.
3. Run `npm install` from the command line before you run the application for the first time - your current working directory should be set to CloudWrangle's root.

You are then able to run `npm start` to boot the server. By default, this will be accessible on [http://localhost:3000]().

### Development Building

1. Copy `src/config/config.example.json` to `src/config/config.json` and edit to fit your details accordingly.
2. With NodeJS installed:
    1. If you do not have Bower and Grunt installed globally yet, run `npm install -g grunt-cli bower`.
    2. You will need Sass (and therefore Ruby) installed. Most Linux-based systems, including OS X, ship with Ruby by default, so you just need to run `gem install sass`.
    2. For your first build, with the current working directory set to this project directory, run `npm install && bower install` to install necessary dependencies.
    3. Run `grunt`, again with the current working directory set to this project directory.

You are then able to run `npm start` to boot the server. By default, this will be accessible on [http://localhost:3000]().