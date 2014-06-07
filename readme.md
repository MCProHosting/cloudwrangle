# CloudWrangle

CloudWrangle was built as an application to manage very large numbers of domain records from CloudFlare. It should be noted that CloudWrangle is for personal use and should *never* be run on a public-facing server.

### Setup

1. Copy `src/config/config.example.json` to `src/config/config.json` and edit to fit your details accordingly.
2. With NodeJS installed:
    1. If you do not have Bower and Grunt installed globally yet, run `npm install -g grunt-cli bower`.
    2. For your first build, with the current working directory set to this project directory, run `npm install && bower install` to install necessary dependencies.
    3. Run `grunt`, again with the current working directory set to this project directory.

You are then able to run `npm start` to boot the server. By default, this will be accessible on [http://localhost:3000]().